'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
	SheetTrigger,
} from '@workspace/ui/components/sheet';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Check, Pencil, X } from 'lucide-react';
import { type ReactElement, useCallback, useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { WebsiteProjectFormFields } from './website-project-fields';
import {
	toWebsiteProjectUpdatePayload,
	useWebsiteProjectForm,
	type WebsiteProjectFormValues,
	websiteProjectDocToFormDefaults,
} from './website-project-form-shared';

const FORM_ID = 'edit-website-project-form';

export default function EditWebsiteProjectForm({
	websiteProjectId,
	trigger,
	project: projectProp,
	open: controlledOpen,
	onOpenChange,
}: {
	websiteProjectId: Id<'websiteProjects'>;
	trigger?: ReactElement;
	project?: Doc<'websiteProjects'>;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const queriedProject = useQuery(
		api.websiteProjects.get.get,
		projectProp ? 'skip' : { websiteProjectId }
	);
	const project = projectProp ?? queriedProject;
	const isControlled = controlledOpen !== undefined;
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen = (next: boolean) => {
		if (!isControlled) {
			setUncontrolledOpen(next);
		}
		onOpenChange?.(next);
	};

	const updateWebsiteProject = useMutation(api.websiteProjects.update.update);

	const form = useWebsiteProjectForm(async (value) => {
		try {
			await updateWebsiteProject({
				websiteProjectId,
				...toWebsiteProjectUpdatePayload(value),
			});
			toastManager.add({
				title: 'Project updated',
				type: 'success',
			});
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update project. Please try again in a moment.'
				),
				title: 'Could not update project',
				type: 'error',
			});
		}
	});

	const hydrateFromProject = useCallback(
		(nextProject: Doc<'websiteProjects'>) => {
			const defaults = websiteProjectDocToFormDefaults(nextProject);
			form.reset();
			for (const [key, value] of Object.entries(defaults)) {
				form.setFieldValue(
					key as keyof WebsiteProjectFormValues,
					value as never
				);
			}
		},
		[form]
	);

	useEffect(() => {
		if (!(open && project)) {
			return;
		}
		hydrateFromProject(project);
	}, [hydrateFromProject, open, project]);

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (next) {
					if (project) {
						hydrateFromProject(project);
					}
				} else {
					form.reset();
				}
			}}
			open={open}
		>
			{isControlled ? null : (
				<SheetTrigger
					render={
						trigger ?? (
							<Button variant="outline">
								<Pencil aria-hidden /> Edit project
							</Button>
						)
					}
				/>
			)}
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Edit project</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={FORM_ID}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation errors */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-6">
						<WebsiteProjectFormFields form={form} />
					</SheetPanel>
				</form>
				<SheetFooter>
					<SheetClose render={<Button type="button" variant="outline" />}>
						<X aria-hidden /> Cancel
					</SheetClose>
					<Button
						disabled={
							!(
								form.state.isValid &&
								!form.state.isValidating &&
								!form.state.isSubmitting
							)
						}
						form={FORM_ID}
						type="submit"
						variant="outline"
					>
						<Check aria-hidden /> Save
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
