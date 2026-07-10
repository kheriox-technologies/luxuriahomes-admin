'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import AddServiceProvider from './add-service-provider';
import { serviceProviderLabel } from './service-provider-form-shared';

interface ServiceProviderSelectBaseProps {
	/** Show the "New service provider" affordance (opens the Add sheet). */
	allowCreate?: boolean;
	disabled?: boolean;
	/** Message shown when the list is empty. */
	emptyMessage?: string;
	/** Providers to hide from the list (e.g. ones already linked). */
	excludeServiceProviderIds?: Id<'serviceProviders'>[];
	/** Only list providers offering this trade; also pre-selected on create. */
	filterTradeId?: Id<'trades'> | '';
	id?: string;
	invalid?: boolean;
	onBlur?: () => void;
	/**
	 * Single-select only: fires with the chosen (or newly created) provider's
	 * trade ids whenever the selection changes, so a parent form can keep a linked
	 * trade field in sync. Fires with `[]` when the selection is cleared.
	 */
	onProviderTradesChange?: (tradeIds: Id<'trades'>[]) => void;
	placeholder?: string;
}

interface ServiceProviderSelectSingleProps
	extends ServiceProviderSelectBaseProps {
	multiple?: false;
	onValueChange: (next: Id<'serviceProviders'> | '') => void;
	value: Id<'serviceProviders'> | '';
}

interface ServiceProviderSelectMultiProps
	extends ServiceProviderSelectBaseProps {
	multiple: true;
	onValueChange: (next: Id<'serviceProviders'>[]) => void;
	value: Id<'serviceProviders'>[];
}

export type ServiceProviderSelectProps =
	| ServiceProviderSelectSingleProps
	| ServiceProviderSelectMultiProps;

/**
 * The single source of truth for picking service providers anywhere in the app.
 * Works as a single- or multi-select (via `multiple`), can be filtered to a
 * trade (`filterTradeId`), and — when `allowCreate` is set — offers a "New
 * service provider" flow that opens the full Add Service Provider sheet, saves
 * the provider to the shared catalog, and selects it.
 */
export default function ServiceProviderSelect(
	props: ServiceProviderSelectProps
) {
	const {
		id,
		disabled,
		invalid,
		onBlur,
		placeholder,
		emptyMessage,
		excludeServiceProviderIds,
		filterTradeId,
		allowCreate,
	} = props;

	const providers = useQuery(api.serviceProviders.list.list, {});
	const [creating, setCreating] = useState(false);

	const excludeSet = useMemo(
		() => new Set(excludeServiceProviderIds ?? []),
		[excludeServiceProviderIds]
	);
	const availableProviders = useMemo(
		() =>
			(providers ?? []).filter(
				(provider) =>
					!excludeSet.has(provider._id) &&
					(filterTradeId ? provider.tradeIds.includes(filterTradeId) : true)
			),
		[providers, excludeSet, filterTradeId]
	);
	const items = useMemo(
		() => availableProviders.map((provider) => provider._id),
		[availableProviders]
	);
	const labelById = useMemo(() => {
		const map = new Map<Id<'serviceProviders'>, string>();
		for (const provider of providers ?? []) {
			map.set(provider._id, serviceProviderLabel(provider));
		}
		return map;
	}, [providers]);

	const busy = providers === undefined;
	const emptyText = emptyMessage ?? 'No service providers found.';
	const createInitialTradeIds = useMemo(
		() => (filterTradeId ? [filterTradeId] : undefined),
		[filterTradeId]
	);

	const handleCreated = (result: {
		id: Id<'serviceProviders'>;
		tradeIds: Id<'trades'>[];
	}) => {
		if (props.multiple) {
			props.onValueChange([...props.value, result.id]);
		} else {
			props.onValueChange(result.id);
			props.onProviderTradesChange?.(result.tradeIds);
		}
	};

	return (
		<div className="flex w-full flex-col gap-2">
			{props.multiple ? (
				<Combobox<Id<'serviceProviders'>, true>
					disabled={disabled || busy}
					items={items}
					itemToStringLabel={(item) => labelById.get(item) ?? ''}
					multiple
					onValueChange={(next) =>
						props.onValueChange((next as Id<'serviceProviders'>[] | null) ?? [])
					}
					value={props.value}
				>
					<ComboboxChips>
						{props.value.map((providerId) => (
							<ComboboxChip key={providerId}>
								{labelById.get(providerId) ?? providerId}
							</ComboboxChip>
						))}
						<ComboboxChipsInput
							placeholder={
								busy
									? 'Loading service providers…'
									: (placeholder ?? 'Search service providers…')
							}
						/>
					</ComboboxChips>
					<ComboboxPopup>
						<ComboboxEmpty>{emptyText}</ComboboxEmpty>
						<ComboboxList>
							{(item: Id<'serviceProviders'>) => (
								<ComboboxItem key={item} value={item}>
									{labelById.get(item) ?? item}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxPopup>
				</Combobox>
			) : (
				<Combobox<Id<'serviceProviders'>>
					disabled={disabled || busy}
					items={items}
					itemToStringLabel={(item) => labelById.get(item) ?? ''}
					onValueChange={(next) => {
						const nextId = next ?? '';
						props.onValueChange(nextId);
						if (props.onProviderTradesChange) {
							const selected = nextId
								? (providers ?? []).find((p) => p._id === nextId)
								: undefined;
							props.onProviderTradesChange(selected?.tradeIds ?? []);
						}
					}}
					value={props.value === '' ? null : props.value}
				>
					<ComboboxInput
						aria-invalid={invalid}
						id={id}
						onBlur={onBlur}
						placeholder={
							busy
								? 'Loading service providers…'
								: (placeholder ?? 'Select a service provider')
						}
					/>
					<ComboboxPopup>
						<ComboboxEmpty>{emptyText}</ComboboxEmpty>
						<ComboboxList>
							{(item: Id<'serviceProviders'>) => (
								<ComboboxItem key={item} value={item}>
									{labelById.get(item) ?? item}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxPopup>
				</Combobox>
			)}

			{allowCreate ? (
				<div>
					<Button
						disabled={disabled}
						onClick={() => setCreating(true)}
						size="sm"
						type="button"
						variant="ghost"
					>
						<Plus /> New service provider
					</Button>
					<AddServiceProvider
						initialTradeIds={createInitialTradeIds}
						onCreated={handleCreated}
						onOpenChange={setCreating}
						open={creating}
					/>
				</div>
			) : null}
		</div>
	);
}
