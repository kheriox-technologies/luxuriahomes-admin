'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { Input } from '@workspace/ui/components/input';
import { Radio, RadioGroup } from '@workspace/ui/components/radio-group';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
} from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Info, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	emptyStageFormValues,
	stageFormFieldError,
	stageFormSchema,
} from '@/components/stages/stage-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'edit-stage-form';

type Stage = Doc<'stages'>;

export default function EditStage({
	stage,
	open,
	onOpenChange,
}: {
	stage: Stage;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [newDepStageId, setNewDepStageId] = useState<string | null>(null);
	const [newDepType, setNewDepType] = useState<'after' | 'alongWith'>('after');

	const updateStage = useMutation(api.stages.update.update);
	const stages = useQuery(api.stages.list.list, {});

	const form = useForm({
		defaultValues: emptyStageFormValues,
		validators: {
			onChange: stageFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = stageFormSchema.parse(value);
				await updateStage({
					stageId: stage._id,
					name: parsed.name,
					description: parsed.description || undefined,
					dependsOn: parsed.dependsOn.map((d) => ({
						stageId: d.stageId as never,
						type: d.type,
					})),
				});
				toastManager.add({ title: 'Stage updated', type: 'success' });
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update stage. Please try again in a moment.'
					),
					title: 'Could not update stage',
					type: 'error',
				});
				onOpenChange(false);
			}
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reinitializes only when open changes
	useEffect(() => {
		if (!open) {
			form.reset();
			return;
		}
		form.reset(
			{
				name: stage.name,
				description: stage.description ?? '',
				dependsOn: stage.dependsOn.map((d) => ({
					stageId: d.stageId,
					type: d.type,
				})),
			},
			{ keepDefaultValues: true }
		);
		setNewDepStageId(null);
		setNewDepType('after');
	}, [open]);

	function handleAddDependency() {
		if (!newDepStageId) {
			return;
		}
		const current = form.getFieldValue('dependsOn') ?? [];
		if (current.some((d) => d.stageId === newDepStageId)) {
			return;
		}
		form.setFieldValue('dependsOn', [
			...current,
			{ stageId: newDepStageId, type: newDepType },
		]);
		setNewDepStageId(null);
		setNewDepType('after');
	}

	function handleRemoveDependency(index: number) {
		const current = form.getFieldValue('dependsOn') ?? [];
		form.setFieldValue(
			'dependsOn',
			current.filter((_, i) => i !== index)
		);
	}

	const currentDepIds =
		form.getFieldValue('dependsOn')?.map((d) => d.stageId) ?? [];
	const availableStages = (stages ?? []).filter(
		(s) => s._id !== stage._id && !currentDepIds.includes(s._id)
	);

	const currentDeps = form.getFieldValue('dependsOn') ?? [];
	const stageNameById = new Map((stages ?? []).map((s) => [s._id, s.name]));

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Edit Stage</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={FORM_ID}
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-6">
						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Stage details
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="space-y-4">
								<form.Field name="name">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Name</FieldLabel>
												<Input
													aria-invalid={invalid}
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Stage name"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{stageFormFieldError(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="description">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Description{' '}
												<span className="text-muted-foreground">
													(optional)
												</span>
											</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Stage description"
												value={field.state.value ?? ''}
											/>
										</Field>
									)}
								</form.Field>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Add dependency
								</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<div className="flex w-full flex-col gap-2">
									<Combobox
										itemToStringLabel={(val) =>
											stageNameById.get(val as never) ?? String(val ?? '')
										}
										onValueChange={(val) => setNewDepStageId(val ?? null)}
										value={newDepStageId}
									>
										<ComboboxInput placeholder="Select stage" />
										<ComboboxPopup>
											<ComboboxList>
												<ComboboxEmpty>No stages available.</ComboboxEmpty>
												{availableStages.map((s) => (
													<ComboboxItem key={s._id} value={s._id}>
														{s.name}
													</ComboboxItem>
												))}
											</ComboboxList>
										</ComboboxPopup>
									</Combobox>
									<div className="flex w-full items-center gap-3">
										<RadioGroup
											className="flex flex-row gap-4"
											onValueChange={(val) =>
												setNewDepType(val as 'after' | 'alongWith')
											}
											value={newDepType}
										>
											<label
												className="flex cursor-pointer items-center gap-2 text-sm"
												htmlFor="edit-stage-dep-after"
											>
												<Radio id="edit-stage-dep-after" value="after" />
												After
											</label>
											<label
												className="flex cursor-pointer items-center gap-2 text-sm"
												htmlFor="edit-stage-dep-along"
											>
												<Radio id="edit-stage-dep-along" value="alongWith" />
												Along with
											</label>
										</RadioGroup>
										<Button
											aria-label="Add dependency"
											className="ml-auto"
											disabled={!newDepStageId}
											onClick={handleAddDependency}
											size="icon"
											type="button"
											variant="outline"
										>
											<Plus />
										</Button>
									</div>
								</div>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Dependencies
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="p-0">
								{currentDeps.length === 0 ? (
									<Alert variant="info">
										<Info />
										<AlertDescription>
											No dependencies added yet.
										</AlertDescription>
									</Alert>
								) : (
									<div className="flex w-full flex-col">
										{currentDeps.map((dep, index) => (
											<div
												className="flex w-full items-center justify-between rounded-lg border px-3 py-2"
												key={`${dep.stageId}-${index}`}
											>
												<span className="font-medium text-sm">
													{stageNameById.get(dep.stageId as never) ??
														dep.stageId}
												</span>
												<div className="flex items-center gap-2">
													<Badge size="lg" variant="outline">
														{dep.type === 'after' ? 'after' : 'along with'}
													</Badge>
													<Button
														aria-label="Remove dependency"
														onClick={() => handleRemoveDependency(index)}
														size="icon"
														type="button"
														variant="destructive-outline"
													>
														<X />
													</Button>
												</div>
											</div>
										))}
									</div>
								)}
							</FramePanel>
						</Frame>
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
					>
						Save
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
