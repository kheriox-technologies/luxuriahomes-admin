// Utilities for extracting files and their originating folder structure from
// either a `<input webkitdirectory>` selection or a drag-and-drop DataTransfer.
// `relativeDir` uses the ORIGINAL folder names (kebab conversion happens
// server-side in `ensureFolder`); it is "" for loose files at the drop root.

export interface UploadEntry {
	file: File;
	relativeDir: string;
}

const leadingSlashPattern = /^\//;

// Strips the filename off a slash-delimited path, returning the directory part.
function dirOf(path: string): string {
	const lastSlash = path.lastIndexOf('/');
	return lastSlash > 0 ? path.slice(0, lastSlash) : '';
}

// Extracts entries from a file input. When the input has `webkitdirectory`,
// each File carries a `webkitRelativePath` like "TopFolder/sub/file.pdf".
export function entriesFromInput(files: FileList | null): UploadEntry[] {
	if (!files) {
		return [];
	}
	return Array.from(files).map((file) => {
		const relPath = file.webkitRelativePath;
		return {
			file,
			relativeDir: relPath ? dirOf(relPath) : '',
		};
	});
}

function readFile(entry: FileSystemFileEntry): Promise<File> {
	return new Promise((resolve, reject) => {
		entry.file(resolve, reject);
	});
}

function readDirectory(
	reader: FileSystemDirectoryReader
): Promise<FileSystemEntry[]> {
	return new Promise((resolve, reject) => {
		reader.readEntries(resolve, reject);
	});
}

// Recursively walks a FileSystem entry, collecting files with their directory
// path (relative to the drop root, leading slash stripped). Directory readers
// return results in batches, so we loop until an empty batch is returned.
async function collectEntry(
	entry: FileSystemEntry,
	out: UploadEntry[]
): Promise<void> {
	if (entry.isFile) {
		const file = await readFile(entry as FileSystemFileEntry);
		out.push({
			file,
			relativeDir: dirOf(entry.fullPath.replace(leadingSlashPattern, '')),
		});
		return;
	}
	if (entry.isDirectory) {
		const reader = (entry as FileSystemDirectoryEntry).createReader();
		let batch = await readDirectory(reader);
		while (batch.length > 0) {
			for (const child of batch) {
				await collectEntry(child, out);
			}
			batch = await readDirectory(reader);
		}
	}
}

// Extracts entries from a drag-and-drop DataTransfer, preserving folder
// structure via the FileSystem Entry API. Falls back to a flat file list when
// the entries API is unavailable.
export async function readDataTransferEntries(
	dataTransfer: DataTransfer
): Promise<UploadEntry[]> {
	const items = Array.from(dataTransfer.items).filter(
		(item) => item.kind === 'file'
	);

	const supportsEntries =
		items.length > 0 && typeof items[0].webkitGetAsEntry === 'function';

	if (!supportsEntries) {
		return Array.from(dataTransfer.files).map((file) => ({
			file,
			relativeDir: '',
		}));
	}

	const roots = items
		.map((item) => item.webkitGetAsEntry())
		.filter((entry): entry is FileSystemEntry => entry !== null);

	const out: UploadEntry[] = [];
	for (const root of roots) {
		await collectEntry(root, out);
	}
	return out;
}
