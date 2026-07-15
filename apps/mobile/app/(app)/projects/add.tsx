import { api } from '@workspace/backend/api';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { ProjectForm } from '@/components/projects/project-form';
import { ScreenFormHeader } from '@/components/screen-form-header';
import {
	convexErrorMessage,
	emptyProjectFormValues,
	type ProjectFormValues,
	type ProjectStoredClient,
	toConvexCreatePayload,
} from '@/lib/project-form';

export default function AddProjectScreen() {
	const router = useRouter();
	const addProject = useMutation(api.projects.add.add);
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (
		values: ProjectFormValues,
		clients: ProjectStoredClient[]
	) => {
		setSubmitting(true);
		try {
			await addProject(toConvexCreatePayload(values, clients));
			router.back();
		} catch (error) {
			Alert.alert(
				'Could not create project',
				convexErrorMessage(error, 'Please try again in a moment.')
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<View className="flex-1 bg-background">
			<ScreenFormHeader title="Add project" />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				className="flex-1"
			>
				<ProjectForm
					initialClients={[]}
					initialValues={emptyProjectFormValues}
					mode="create"
					onSubmit={handleSubmit}
					submitting={submitting}
				/>
			</KeyboardAvoidingView>
		</View>
	);
}
