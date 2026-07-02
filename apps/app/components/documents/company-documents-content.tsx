'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction, useMutation } from 'convex/react';
import { FileText } from 'lucide-react';
import PageHeading from '@/components/page-heading';
import { ProjectFileManagerTabContent } from '../projects/project-file-manager-tab-content';

export default function CompanyDocumentsContent() {
	const generateUploadUrl = useAction(
		api.companyDocuments.generateUploadUrl.generateUploadUrl
	);
	const createDocument = useMutation(api.companyDocuments.create.create);
	const createFolder = useMutation(
		api.companyDocuments.createFolder.createFolder
	);
	const renameDocument = useAction(api.companyDocuments.rename.rename);
	const moveDocument = useAction(api.companyDocuments.move.move);
	const removeDocument = useAction(api.companyDocuments.remove.remove);
	const renameFolderAction = useAction(
		api.companyDocuments.renameFolder.renameFolder
	);
	const deleteFolderAction = useAction(
		api.companyDocuments.deleteFolder.deleteFolder
	);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading heading="Documents" icon={FileText} />
			<ProjectFileManagerTabContent
				buildQueryArgs={(folderPath) => ({ folderPath })}
				emptyTitle="No documents yet"
				listContentsQuery={api.companyDocuments.listContents.listContents}
				onCreateFile={async (args) => {
					await createDocument(args);
				}}
				onCreateFolder={async ({ name, parentPath }) => {
					await createFolder({ name, parentPath });
				}}
				onDeleteFolder={async (folderId) => {
					await deleteFolderAction({
						folderId: folderId as Id<'companyDocumentFolders'>,
					});
				}}
				onGenerateUploadUrl={async (args) => generateUploadUrl(args)}
				onMoveFile={async (fileId, targetFolderPath) => {
					await moveDocument({
						documentId: fileId as Id<'companyDocuments'>,
						targetFolderPath,
					});
				}}
				onRemoveFile={async (fileId) => {
					await removeDocument({
						documentId: fileId as Id<'companyDocuments'>,
					});
				}}
				onRenameFile={async (fileId, newName) => {
					await renameDocument({
						documentId: fileId as Id<'companyDocuments'>,
						newName,
					});
				}}
				onRenameFolder={async (folderId, newName) => {
					await renameFolderAction({
						folderId: folderId as Id<'companyDocumentFolders'>,
						newName,
					});
				}}
				rootLabel="Documents"
			/>
		</div>
	);
}
