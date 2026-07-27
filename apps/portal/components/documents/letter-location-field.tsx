'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { useQuery } from 'convex/react';
import { FolderInput, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MoveFolderPicker } from '@/components/projects/project-file-manager-tab-content';

export type LetterDestination =
	| { scope: 'company'; folderPath: string }
	| { scope: 'project'; projectId: Id<'projects'>; folderPath: string };

const COMPANY_KEY = 'company';
// Non-empty sentinel passed as `currentFolderPath` so no node (incl. Root) is
// disabled in the picker — unlike Move, every folder is a valid letter target.
const NO_DISABLED_PATH = ' ';

function folderLabel(folderPath: string): string {
	return folderPath === '' ? 'Root' : folderPath;
}

export default function LetterLocationField({
	value,
	onChange,
}: {
	onChange: (next: LetterDestination) => void;
	value: LetterDestination;
}) {
	const projects = useQuery(api.projects.list.list, {});
	const [open, setOpen] = useState(false);

	// Draft selection inside the dialog (committed on "Select location").
	const [scopeKey, setScopeKey] = useState<string>(COMPANY_KEY);
	const [folderPath, setFolderPath] = useState('');

	const projectNameById = useMemo(() => {
		const map = new Map<string, string>();
		for (const project of projects ?? []) {
			map.set(project._id, project.name);
		}
		return map;
	}, [projects]);

	const sectionItems = useMemo(
		() => [COMPANY_KEY, ...(projects ?? []).map((project) => project._id)],
		[projects]
	);

	const sectionLabel = (key: string) =>
		key === COMPANY_KEY
			? 'Company Documents'
			: (projectNameById.get(key) ?? 'Project');

	const currentLabel =
		value.scope === 'company'
			? `Company Documents / ${folderLabel(value.folderPath)}`
			: `${projectNameById.get(value.projectId) ?? 'Project'} / ${folderLabel(
					value.folderPath
				)}`;

	const openDialog = () => {
		setScopeKey(value.scope === 'company' ? COMPANY_KEY : value.projectId);
		setFolderPath(value.folderPath);
		setOpen(true);
	};

	const confirm = () => {
		onChange(
			scopeKey === COMPANY_KEY
				? { scope: 'company', folderPath }
				: {
						scope: 'project',
						projectId: scopeKey as Id<'projects'>,
						folderPath,
					}
		);
		setOpen(false);
	};

	const isCompany = scopeKey === COMPANY_KEY;
	const pickerBuildQueryArgs = (path: string) =>
		isCompany
			? { folderPath: path }
			: { projectId: scopeKey as Id<'projects'>, folderPath: path };

	const pickerListQuery = isCompany
		? api.companyDocuments.listContents.listContents
		: api.projectDocuments.listContents.listContents;

	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 text-sm sm:h-7">
				<MapPin aria-hidden className="size-4 text-muted-foreground" />
				{currentLabel}
			</span>
			<Button onClick={openDialog} size="sm" type="button" variant="outline">
				Change location
			</Button>

			<Dialog onOpenChange={setOpen} open={open}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Choose location</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-3 px-6 pb-2">
						<Combobox<string>
							items={sectionItems}
							itemToStringLabel={(item) => sectionLabel(item)}
							onValueChange={(next) => {
								setScopeKey(next ?? COMPANY_KEY);
								// Folder paths differ per section — reset to root.
								setFolderPath('');
							}}
							value={scopeKey}
						>
							<ComboboxInput placeholder="Company Documents or a project…" />
							<ComboboxPopup>
								<ComboboxEmpty>No section found.</ComboboxEmpty>
								<ComboboxList>
									{(item: string) => (
										<ComboboxItem key={item} value={item}>
											{sectionLabel(item)}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxPopup>
						</Combobox>

						<div className="max-h-72 overflow-y-auto rounded-md border p-2">
							<MoveFolderPicker
								buildQueryArgs={pickerBuildQueryArgs}
								currentFolderPath={NO_DISABLED_PATH}
								listContentsQuery={pickerListQuery}
								onSelect={setFolderPath}
								selected={folderPath}
							/>
						</div>
					</div>
					<DialogFooter>
						<DialogClose render={<Button type="button" variant="outline" />}>
							Cancel
						</DialogClose>
						<Button onClick={confirm} type="button" variant="outline">
							<FolderInput aria-hidden /> Select location
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
