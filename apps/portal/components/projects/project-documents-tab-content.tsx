'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction, useMutation } from 'convex/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProjectFileManagerTabContent } from './project-file-manager-tab-content';

export default function ProjectDocumentsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const generateUploadUrl = useAction(
		api.projectDocuments.generateUploadUrl.generateUploadUrl
	);
	const createDocument = useMutation(api.projectDocuments.create.create);
	const createFolder = useMutation(
		api.projectDocuments.createFolder.createFolder
	);
	const ensureFolder = useMutation(
		api.projectDocuments.ensureFolder.ensureFolder
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
	const setClientPortalVisibility = useMutation(
		api.projectDocuments.setClientPortalVisibility.setClientPortalVisibility
	);
	const setFolderClientPortalVisibility = useMutation(
		api.projectDocuments.setFolderClientPortalVisibility
			.setFolderClientPortalVisibility
	);
	const addToTakeoffs = useAction(api.takeoffs.addToTakeoffs.addToTakeoffs);
	const sendBillToXero = useAction(api.xero.emailBillToXero.sendBillToXeroNow);

	return (
		<ProjectFileManagerTabContent
			buildQueryArgs={(folderPath) => ({ projectId, folderPath })}
			emptyTitle="No documents yet"
			listContentsQuery={api.projectDocuments.listContents.listContents}
			onAddToTakeoffs={async (fileId, title) => {
				await addToTakeoffs({
					documentId: fileId as Id<'projectDocuments'>,
					title,
				});
				const params = new URLSearchParams(searchParams.toString());
				params.set('tab', 'takeoffs');
				router.push(`?${params.toString()}`);
			}}
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
			onEnsureFolder={async ({ parentPath, segments }) =>
				ensureFolder({ projectId, parentPath, segments })
			}
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
			onSendBillToXero={async (fileId) => {
				const result = await sendBillToXero({
					documentId: fileId as Id<'projectDocuments'>,
				});
				if (!result.ok) {
					throw new Error(result.error ?? 'Xero send failed');
				}
			}}
			onSetClientPortalVisibility={async (fileId, visible) => {
				await setClientPortalVisibility({
					documentId: fileId as Id<'projectDocuments'>,
					visible,
				});
			}}
			onSetFolderClientPortalVisibility={async (folderId, visible) =>
				await setFolderClientPortalVisibility({
					folderId: folderId as Id<'projectDocumentFolders'>,
					visible,
				})
			}
			projectId={projectId}
			rootLabel="Documents"
		/>
	);
}
