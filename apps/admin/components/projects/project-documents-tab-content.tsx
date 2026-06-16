'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction, useMutation } from 'convex/react';
import { ProjectFileManagerTabContent } from './project-file-manager-tab-content';

export default function ProjectDocumentsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const generateUploadUrl = useAction(
		api.projectDocuments.generateUploadUrl.generateUploadUrl
	);
	const createDocument = useMutation(api.projectDocuments.create.create);
	const createFolder = useMutation(
		api.projectDocuments.createFolder.createFolder
	);
	const renameDocument = useAction(api.projectDocuments.rename.rename);
	const moveDocument = useAction(api.projectDocuments.move.move);
	const removeDocument = useAction(api.projectDocuments.remove.remove);
	const renameFolderAction = useAction(
		api.projectDocuments.renameFolder.renameFolder
	);
	const deleteFolderAction = useAction(
		api.projectDocuments.deleteFolder.deleteFolder
	);

	return (
		<ProjectFileManagerTabContent
			buildQueryArgs={(folderPath) => ({ projectId, folderPath })}
			emptyTitle="No documents yet"
			listContentsQuery={api.projectDocuments.listContents.listContents}
			onCreateFile={async (args) => {
				await createDocument({ ...args, projectId });
			}}
			onCreateFolder={async ({ name, parentPath }) => {
				await createFolder({ projectId, name, parentPath });
			}}
			onDeleteFolder={async (folderId) => {
				await deleteFolderAction({
					folderId: folderId as Id<'projectDocumentFolders'>,
				});
			}}
			onGenerateUploadUrl={async (args) =>
				generateUploadUrl({ ...args, projectId })
			}
			onMoveFile={async (fileId, targetFolderPath) => {
				await moveDocument({
					documentId: fileId as Id<'projectDocuments'>,
					targetFolderPath,
				});
			}}
			onRemoveFile={async (fileId) => {
				await removeDocument({
					documentId: fileId as Id<'projectDocuments'>,
				});
			}}
			onRenameFile={async (fileId, newName) => {
				await renameDocument({
					documentId: fileId as Id<'projectDocuments'>,
					newName,
				});
			}}
			onRenameFolder={async (folderId, newName) => {
				await renameFolderAction({
					folderId: folderId as Id<'projectDocumentFolders'>,
					newName,
				});
			}}
			rootLabel="Documents"
		/>
	);
}
