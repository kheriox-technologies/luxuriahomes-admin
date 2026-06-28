'use client';

import { api } from '@workspace/backend/api';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction } from 'convex/react';
import { useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import type { UserRow } from './types';
import { useRoleOptions } from './use-role-options';
import UserRolesMultiSelect from './user-roles-multi-select';

/**
 * Inline roles editor rendered in the Users table. Selecting or deselecting a
 * role immediately persists to Clerk and refreshes the list.
 */
export default function UserRolesCell({
	user,
	onUpdated,
}: {
	user: UserRow;
	onUpdated: () => void;
}) {
	const setRoles = useAction(api.users.setRoles.setRoles);
	const roleOptions = useRoleOptions();
	const [roles, setLocalRoles] = useState<string[]>(user.roles);
	const [isSaving, setIsSaving] = useState(false);

	// Keep local state in sync when the list refreshes with new data.
	useEffect(() => {
		setLocalRoles(user.roles);
	}, [user.roles]);

	const handleChange = async (next: string[]) => {
		const previous = roles;
		setLocalRoles(next);
		setIsSaving(true);
		try {
			await setRoles({ userId: user.userId, roles: next });
			toastManager.add({ title: 'Roles updated', type: 'success' });
			onUpdated();
		} catch (error) {
			setLocalRoles(previous);
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update roles. Please try again in a moment.'
				),
				title: 'Could not update roles',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="min-w-56">
			<UserRolesMultiSelect
				disabled={isSaving}
				id={`roles-${user.userId}`}
				onChange={(next) => {
					handleChange(next).catch(() => {
						/* handled in handleChange */
					});
				}}
				options={roleOptions}
				value={roles}
			/>
		</div>
	);
}
