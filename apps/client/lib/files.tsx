import { File, FileSpreadsheet, FileText, type LucideIcon } from 'lucide-react';

export function formatFileSize(bytes: number): string {
	if (bytes < 1024) {
		return `${bytes} B`;
	}
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(0)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(timestamp: number): string {
	return new Intl.DateTimeFormat('en-AU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(new Date(timestamp));
}

function iconFor(mimeType?: string): { Icon: LucideIcon; className: string } {
	if (!mimeType) {
		return { Icon: File, className: 'text-muted-foreground' };
	}
	if (mimeType.includes('pdf')) {
		return { Icon: FileText, className: 'text-red-500' };
	}
	if (mimeType.startsWith('image/')) {
		return { Icon: File, className: 'text-blue-500' };
	}
	if (
		mimeType.includes('wordprocessingml') ||
		mimeType === 'application/msword'
	) {
		return { Icon: FileText, className: 'text-blue-600' };
	}
	if (
		mimeType.includes('spreadsheetml') ||
		mimeType === 'application/vnd.ms-excel'
	) {
		return { Icon: FileSpreadsheet, className: 'text-green-600' };
	}
	if (
		mimeType.includes('presentationml') ||
		mimeType === 'application/vnd.ms-powerpoint'
	) {
		return { Icon: File, className: 'text-orange-500' };
	}
	return { Icon: File, className: 'text-muted-foreground' };
}

export function FileIcon({ mimeType }: { mimeType?: string }) {
	const { Icon, className } = iconFor(mimeType);
	return <Icon className={`size-4 ${className}`} />;
}

const OFFICE_MIME_TYPES = new Set([
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/msword',
	'application/vnd.ms-excel',
	'application/vnd.ms-powerpoint',
]);

export function getOpenUrl(
	mimeType: string | undefined,
	signedUrl: string
): string {
	if (mimeType && OFFICE_MIME_TYPES.has(mimeType)) {
		return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(signedUrl)}`;
	}
	return signedUrl;
}
