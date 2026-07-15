import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { ProjectForm } from '@/components/projects/project-form';
import { ScreenFormHeader } from '@/components/screen-form-header';
import { ListSkeleton } from '@/components/ui/skeleton';
import {
	convexErrorMessage,
	type ProjectFormValues,
	type ProjectStoredClient,
	toConvexUpdatePayload,
} from '@/lib/project-form';

export default function EditProjectScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const router = useRouter();
	const project = useQuery(api.projects.get.get, {
		projectId: projectId as Id<'projects'>,
	});
	const updateProject = useMutation(api.projects.update.update);
	const removeProject = useMutation(api.projects.remove.remove);
	const [submitting, setSubmitting] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const handleSubmit = async (
		values: ProjectFormValues,
		clients: ProjectStoredClient[]
	) => {
		setSubmitting(true);
		try {
			await updateProject({
				projectId: projectId as Id<'projects'>,
				...toConvexUpdatePayload(values, clients),
			});
			router.back();
		} catch (error) {
			Alert.alert(
				'Could not save changes',
				convexErrorMessage(error, 'Please try again in a moment.')
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async () => {
		setDeleting(true);
		try {
			await removeProject({ projectId: projectId as Id<'projects'> });
			router.back();
		} catch (error) {
			Alert.alert(
				'Could not delete project',
				convexErrorMessage(error, 'Please try again in a moment.')
			);
			setDeleting(false);
		}
	};

	const initialValues: ProjectFormValues | null = project
		? {
				name: project.name,
				address: {
					street: project.address.street,
					suburb: project.address.suburb,
					state: project.address.state,
					postcode: project.address.postcode,
				},
				status: project.status,
				startDate: project.startDate ? new Date(project.startDate) : undefined,
				quotePrice: project.quotePrice,
				xeroTrackingOptionId: project.xeroTrackingOptionId,
			}
		: null;

	return (
		<View className="flex-1 bg-background">
			<ScreenFormHeader title="Edit project" />
			{project === undefined ? <ListSkeleton /> : null}
			{project && initialValues ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					className="flex-1"
				>
					<ProjectForm
						deleting={deleting}
						initialClients={project.clients}
						initialValues={initialValues}
						mode="edit"
						onDelete={handleDelete}
						onSubmit={handleSubmit}
						submitting={submitting}
					/>
				</KeyboardAvoidingView>
			) : null}
		</View>
	);
}
