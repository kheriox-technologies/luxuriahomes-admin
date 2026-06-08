'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
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
	SheetTrigger,
} from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Info, Plus, X } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import {
	emptyStageFormValues,
	stageFormFieldError,
	stageFormSchema,
} from '@/components/stages/stage-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'add-stage-form';

export default function AddStage({ trigger }: { trigger?: ReactElement } = {}) {
	const [open, setOpen] = useState(false);
	const [newDepStageId, setNewDepStageId] = useState<string | null>(null);
	const [newDepType, setNewDepType] = useState<'after' | 'alongWith'>('after');
	const [newOrderId, setNewOrderId] = useState<string | null>(null);

	const addStage = useMutation(api.stages.add.add);
	const updateStage = useMutation(api.stages.update.update);
	const updateOrder = useMutation(api.orders.update.update);
	const stages = useQuery(api.stages.list.list, {});
	const orders = useQuery(api.orders.list.list, {});

	const form = useForm({
		defaultValues: emptyStageFormValues,
		validators: {
			onChange: stageFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = stageFormSchema.parse(value);
				const stageId = await addStage({
					name: parsed.name,
					description: parsed.description || undefined,
				});

				if (parsed.dependsOn.length > 0) {
					await updateStage({
						stageId,
						name: parsed.name,
						description: parsed.description || undefined,
						dependsOn: parsed.dependsOn.map((d) => ({
							stageId: d.stageId as typeof stageId,
							type: d.type,
						})),
					});
				}

				for (const orderId of parsed.linkedOrderIds) {
					const order = orders?.find((o) => (o._id as string) === orderId);
					if (order) {
						await updateOrder({
							orderId: order._id,
							name: order.name,
							description: order.description,
							stageId,
							taskId: undefined,
							materials: order.materials,
						});
					}
				}

				toastManager.add({ title: 'Stage added', type: 'success' });
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add stage. Please try again in a moment.'
					),
					title: 'Could not add stage',
					type: 'error',
				});
				form.reset();
				setOpen(false);
			}
		},
	});

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

	function handleAddOrder() {
		if (!newOrderId) {
			return;
		}
		const current = form.getFieldValue('linkedOrderIds') ?? [];
		if (current.includes(newOrderId)) {
			return;
		}
		form.setFieldValue('linkedOrderIds', [...current, newOrderId]);
		setNewOrderId(null);
	}

	function handleRemoveOrder(index: number) {
		const current = form.getFieldValue('linkedOrderIds') ?? [];
		form.setFieldValue(
			'linkedOrderIds',
			current.filter((_, i) => i !== index)
		);
	}

	const currentDepIds =
		form.getFieldValue('dependsOn')?.map((d) => d.stageId) ?? [];
	const availableStages = (stages ?? []).filter(
		(s) => !currentDepIds.includes(s._id)
	);

	const currentOrderIds = form.getFieldValue('linkedOrderIds') ?? [];
	const availableOrders = (orders ?? []).filter(
		(o) => !currentOrderIds.includes(o._id)
	);

	const linkedOrders = currentOrderIds
		.map((id) => orders?.find((o) => o._id === id))
		.filter(Boolean);

	const currentDeps = form.getFieldValue('dependsOn') ?? [];
	const stageNameById = new Map((stages ?? []).map((s) => [s._id, s.name]));

	return (
		<Sheet
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (nextOpen) {
					const lastStage = stages && stages.length > 0 ? stages.at(-1) : null;
					const initialDeps = lastStage
						? [{ stageId: lastStage._id as string, type: 'after' as const }]
						: [];
					form.reset(
						{ ...emptyStageFormValues, dependsOn: initialDeps },
						{ keepDefaultValues: true }
					);
					setNewDepStageId(null);
					setNewDepType('after');
					setNewOrderId(null);
				} else {
					form.reset();
				}
			}}
			open={open}
		>
			<SheetTrigger render={trigger ?? <Button>Add Stage</Button>} />
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Add Stage</SheetTitle>
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
													autoFocus
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
												{availableStages.map((stage) => (
													<ComboboxItem key={stage._id} value={stage._id}>
														{stage.name}
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
												htmlFor="add-stage-dep-after"
											>
												<Radio id="add-stage-dep-after" value="after" />
												After
											</label>
											<label
												className="flex cursor-pointer items-center gap-2 text-sm"
												htmlFor="add-stage-dep-along"
											>
												<Radio id="add-stage-dep-along" value="alongWith" />
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
													<Badge variant="outline">
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

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Link order
								</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<div className="flex w-full gap-2">
									<div className="flex-1">
										<Combobox
											itemToStringLabel={(val) =>
												(orders ?? []).find((o) => (o._id as string) === val)
													?.name ?? String(val ?? '')
											}
											onValueChange={(val) => setNewOrderId(val ?? null)}
											value={newOrderId}
										>
											<ComboboxInput placeholder="Select order" />
											<ComboboxPopup>
												<ComboboxList>
													<ComboboxEmpty>No orders available.</ComboboxEmpty>
													{availableOrders.map((order) => (
														<ComboboxItem key={order._id} value={order._id}>
															{order.name}
														</ComboboxItem>
													))}
												</ComboboxList>
											</ComboboxPopup>
										</Combobox>
									</div>
									<Button
										aria-label="Add order"
										disabled={!newOrderId}
										onClick={handleAddOrder}
										size="icon"
										type="button"
										variant="outline"
									>
										<Plus />
									</Button>
								</div>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Linked orders
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="p-0">
								{linkedOrders.length === 0 ? (
									<Alert variant="info">
										<Info />
										<AlertDescription>No orders linked yet.</AlertDescription>
									</Alert>
								) : (
									<div className="flex w-full flex-col">
										{linkedOrders.map((order, index) =>
											order ? (
												<div
													className="flex w-full items-center justify-between rounded-lg border px-3 py-2"
													key={order._id}
												>
													<span className="font-medium text-sm">
														{order.name}
													</span>
													<Button
														aria-label={`Remove ${order.name}`}
														onClick={() => handleRemoveOrder(index)}
														size="icon"
														type="button"
														variant="destructive-outline"
													>
														<X />
													</Button>
												</div>
											) : null
										)}
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
						Add Stage
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
