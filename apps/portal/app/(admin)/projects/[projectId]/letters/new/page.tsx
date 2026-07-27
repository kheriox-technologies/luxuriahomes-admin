import type { Id } from '@workspace/backend/dataModel';
import LetterComposer from '@/components/documents/letter-composer';

export default async function NewProjectLetterPage({
	params,
	searchParams,
}: {
	params: Promise<{ projectId: string }>;
	searchParams: Promise<{ folder?: string; prefill?: string }>;
}) {
	const { projectId } = await params;
	const { folder, prefill } = await searchParams;
	return (
		<LetterComposer
			defaultDestination={{
				scope: 'project',
				projectId: projectId as Id<'projects'>,
				folderPath: folder ?? '',
			}}
			prefill={prefill === '1'}
		/>
	);
}
