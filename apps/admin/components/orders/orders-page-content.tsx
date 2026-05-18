'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Frame, FramePanel } from '@workspace/ui/components/frame';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { useQuery } from 'convex/react';
import { ClipboardList, Pencil, SearchIcon, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AddOrder from '@/components/orders/add-order';
import DeleteOrder from '@/components/orders/delete-order';
import EditOrder from '@/components/orders/edit-order';
import PageHeading from '@/components/page-heading';

type Order = Doc<'orders'>;

function OrderActionsCell({ order }: { order: Order }) {
	return (
		<Group className="justify-end">
			<EditOrder
				initialDescription={order.description}
				initialDuration={order.duration}
				initialName={order.name}
				orderId={order._id}
				trigger={
					<Button
						aria-label="Edit order"
						size="icon"
						type="button"
						variant="outline"
					>
						<Pencil />
					</Button>
				}
			/>
			<GroupSeparator />
			<DeleteOrder
				orderId={order._id}
				orderName={order.name}
				trigger={
					<Button
						aria-label="Delete order"
						size="icon"
						type="button"
						variant="destructive-outline"
					>
						<Trash2 />
					</Button>
				}
			/>
		</Group>
	);
}

export default function OrdersPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.orders.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.orders.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const orders = trimmedSearch === '' ? listResults : searchResults;

	const stages = useQuery(api.stages.list.list, {});
	const tasks = useQuery(api.tasks.listAll.listAll, {});

	const stageNameById = useMemo(() => {
		const m = new Map<string, string>();
		for (const s of stages ?? []) {
			m.set(s._id, s.name);
		}
		return m;
	}, [stages]);

	const taskNameById = useMemo(() => {
		const m = new Map<string, string>();
		for (const t of tasks ?? []) {
			m.set(t._id, t.name);
		}
		return m;
	}, [tasks]);

	if (orders === undefined) {
		return (
			<div className="flex h-full min-h-0 w-full flex-col">
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<PageHeading heading="Orders" icon={ClipboardList} />
				</div>
				<div className="text-muted-foreground text-sm">Loading orders…</div>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 w-full flex-col">
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<PageHeading heading="Orders" icon={ClipboardList} />
				<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
					<InputGroup className="w-full sm:w-64">
						<InputGroupAddon>
							<InputGroupText>
								<SearchIcon className="size-4" />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search orders…"
							value={search}
						/>
					</InputGroup>
					<AddOrder />
				</div>
			</div>
			<div className="flex min-h-0 flex-1 flex-col">
				{orders.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ClipboardList aria-hidden />
							</EmptyMedia>
							<EmptyTitle>
								{trimmedSearch !== '' ? 'No matching orders' : 'No orders yet'}
							</EmptyTitle>
							<EmptyDescription>
								{trimmedSearch !== ''
									? 'Try a different search term.'
									: 'Create your first order using the Add Order button.'}
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<Frame className="w-full">
						<FramePanel className="p-0">
							<div className="w-full min-w-0 overflow-x-auto">
								<Table className="w-full min-w-[52rem]">
									<TableHeader>
										<TableRow>
											<TableHead className="min-w-[12rem]">Name</TableHead>
											<TableHead className="min-w-[16rem]">
												Description
											</TableHead>
											<TableHead className="min-w-[8rem] whitespace-nowrap">
												Duration (Days)
											</TableHead>
											<TableHead className="min-w-[10rem]">Stage</TableHead>
											<TableHead className="min-w-[10rem]">Task</TableHead>
											<TableHead className="w-[120px] min-w-[120px] max-w-[120px] whitespace-nowrap text-end">
												Actions
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{orders.map((order) => (
											<TableRow key={order._id}>
												<TableCell className="align-middle font-medium">
													{order.name}
												</TableCell>
												<TableCell className="max-w-[20rem] align-middle">
													{order.description ? (
														<span className="line-clamp-2">
															{order.description}
														</span>
													) : (
														<span className="text-muted-foreground">—</span>
													)}
												</TableCell>
												<TableCell className="align-middle">
													{order.duration}
												</TableCell>
												<TableCell className="align-middle">
													{order.stageId ? (
														(stageNameById.get(order.stageId) ?? (
															<span className="text-muted-foreground">—</span>
														))
													) : (
														<span className="text-muted-foreground">—</span>
													)}
												</TableCell>
												<TableCell className="align-middle">
													{order.taskId ? (
														(taskNameById.get(order.taskId) ?? (
															<span className="text-muted-foreground">—</span>
														))
													) : (
														<span className="text-muted-foreground">—</span>
													)}
												</TableCell>
												<TableCell className="align-middle">
													<OrderActionsCell order={order} />
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</FramePanel>
					</Frame>
				)}
			</div>
		</div>
	);
}
