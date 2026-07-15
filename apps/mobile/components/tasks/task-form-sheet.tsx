import { useUser } from '@clerk/clerk-expo';
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Check } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Alert, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/date-field';
import { Select, type SelectOption } from '@/components/ui/select';
import { type KanbanStatus, kanbanLabels } from '@/components/ui/status-pill';
import { TextField } from '@/components/ui/text-field';

const STATUSES: KanbanStatus[] = ['planned', 'in_progress', 'blocked', 'done'];

const STATUS_OPTIONS: SelectOption<KanbanStatus>[] = STATUSES.map((status) => ({
	value: status,
	label: kanbanLabels[status],
}));

const NONE = 'none';

type Task = Doc<'tasks'>;

export interface TaskFormSheetHandle {
	present: (task?: Task) => void;
}

/**
 * Add / Edit task bottom sheet. `present()` opens in create mode (assignee
 * defaulted to the current admin user); `present(task)` opens in edit mode with
 * fields pre-filled. Mirrors the portal Add/Edit task sheet (title, description,
 * status, due date, project, assignee).
 */
export function TaskFormSheet({ ref }: { ref?: Ref<TaskFormSheetHandle> }) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);
	const { user } = useUser();

	const addTask = useMutation(api.tasks.add.add);
	const updateTask = useMutation(api.tasks.update.update);
	const projects = useQuery(api.projects.list.list, {});
	const admins = useQuery(api.adminUsers.list.list, {});

	const projectOptions = useMemo<SelectOption<string>[]>(
		() => [
			{ value: NONE, label: 'No project' },
			...(projects ?? []).map((project) => ({
				value: project._id,
				label: project.name,
			})),
		],
		[projects]
	);

	const assigneeOptions = useMemo<SelectOption<string>[]>(
		() => [
			{ value: NONE, label: 'Unassigned' },
			...(admins ?? []).map((admin: Doc<'adminUsers'>) => ({
				value: admin.userId,
				label: admin.fullName,
			})),
		],
		[admins]
	);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState<KanbanStatus>('planned');
	const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
	const [projectId, setProjectId] = useState<string>(NONE);
	const [assigneeId, setAssigneeId] = useState<string>(NONE);
	const [saving, setSaving] = useState(false);
	const [showErrors, setShowErrors] = useState(false);
	const [editingId, setEditingId] = useState<Id<'tasks'> | null>(null);

	useImperativeHandle(ref, () => ({
		present: (task) => {
			setEditingId(task?._id ?? null);
			setTitle(task?.title ?? '');
			setDescription(task?.description ?? '');
			setStatus(task?.status ?? 'planned');
			setDueDate(task?.dueDate ? new Date(task.dueDate) : undefined);
			setProjectId(task?.projectId ?? NONE);
			setAssigneeId(task?.assigneeUserId ?? (task ? NONE : (user?.id ?? NONE)));
			setSaving(false);
			setShowErrors(false);
			sheetRef.current?.present();
		},
	}));

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
			/>
		),
		[]
	);

	const handleSave = async () => {
		if (title.trim() === '') {
			setShowErrors(true);
			return;
		}
		setSaving(true);
		const payload = {
			title: title.trim(),
			description: description.trim() || undefined,
			status,
			dueDate: dueDate?.getTime(),
			projectId: projectId === NONE ? undefined : (projectId as Id<'projects'>),
			assigneeUserId: assigneeId === NONE ? undefined : assigneeId,
		};
		try {
			if (editingId) {
				await updateTask({ taskId: editingId, ...payload });
			} else {
				await addTask(payload);
			}
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert(
				editingId ? 'Could not update task' : 'Could not create task',
				'Please try again.'
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			keyboardBehavior="interactive"
			maxDynamicContentSize={720}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<Text className="px-1 font-sans-semibold text-base text-foreground">
					{editingId ? 'Edit task' : 'Add task'}
				</Text>

				<TextField
					error={
						showErrors && title.trim() === ''
							? 'A title is required'
							: undefined
					}
					label="Title"
					onChangeText={setTitle}
					placeholder="Task title"
					value={title}
				/>

				<TextField
					label="Description (optional)"
					onChangeText={setDescription}
					placeholder="Short description"
					value={description}
				/>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Status
					</Text>
					<Select
						onChange={setStatus}
						options={STATUS_OPTIONS}
						title="Select status"
						value={status}
					/>
				</View>

				<DateField
					label="Due date (optional)"
					onChange={setDueDate}
					value={dueDate}
				/>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Project (optional)
					</Text>
					<Select
						onChange={setProjectId}
						options={projectOptions}
						placeholder={projects === undefined ? 'Loading…' : 'No project'}
						title="Select project"
						value={projectId}
					/>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Assignee (optional)
					</Text>
					<Select
						onChange={setAssigneeId}
						options={assigneeOptions}
						placeholder={admins === undefined ? 'Loading…' : 'Unassigned'}
						title="Select assignee"
						value={assigneeId}
					/>
				</View>

				<Button
					className="mt-1"
					icon={<Check color={colors.foreground} size={18} strokeWidth={2} />}
					loading={saving}
					onPress={handleSave}
				>
					{editingId ? 'Save changes' : 'Save task'}
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
