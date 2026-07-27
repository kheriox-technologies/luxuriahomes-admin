import LetterComposer from '@/components/documents/letter-composer';

export default async function NewCompanyLetterPage({
	searchParams,
}: {
	searchParams: Promise<{ folder?: string; prefill?: string }>;
}) {
	const { folder, prefill } = await searchParams;
	return (
		<LetterComposer
			defaultDestination={{ scope: 'company', folderPath: folder ?? '' }}
			prefill={prefill === '1'}
		/>
	);
}
