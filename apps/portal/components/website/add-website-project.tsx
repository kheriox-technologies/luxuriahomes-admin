'use client';

import { api } from '@workspace/backend/api';
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
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { WebsiteProjectFormFields } from './website-project-fields';
import {
	toWebsiteProjectCreatePayload,
	useWebsiteProjectForm,
} from './website-project-form-shared';

const FORM_ID = 'add-website-project-form';

export default function AddWebsiteProjectForm() {
	const [open, setOpen] = useState(false);
	const addWebsiteProject = useMutation(api.websiteProjects.add.add);

	const form = useWebsiteProjectForm(async (value) => {
		try {
			await addWebsiteProject(toWebsiteProjectCreatePayload(value));
			toastManager.add({
				title: 'Project created',
				type: 'success',
			});
			form.reset();
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not create project. Please try again in a moment.'
				),
				title: 'Could not create project',
				type: 'error',
			});
		}
	});

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					form.reset();
				}
			}}
			open={open}
		>
			<SheetTrigger render={<Button variant="default">Add Project</Button>} />
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Add project</SheetTitle>
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
						Cancel
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
						variant="default"
					>
						Save
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
