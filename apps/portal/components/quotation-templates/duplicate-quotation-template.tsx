'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import { Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QuotationTemplateDialog from './quotation-template-dialog';

export default function DuplicateQuotationTemplate({
	onOpenChange,
	open,
	sourceDescription,
	sourceName,
	sourceTemplateId,
}: {
	onOpenChange: (open: boolean) => void;
	open: boolean;
	sourceDescription?: string;
	sourceName: string;
	sourceTemplateId: Id<'quoteTemplates'>;
}) {
	const router = useRouter();
	const copyTemplate = useMutation(api.quoteTemplates.copy.copy);

	return (
		<QuotationTemplateDialog
			confirmIcon={<Copy aria-hidden />}
			confirmLabel="Duplicate Template"
			errorTitle="Could not duplicate quotation template"
			idPrefix={`duplicate-quotation-template-${sourceTemplateId}`}
			initialDescription={sourceDescription}
			initialName={`${sourceName} (copy)`}
			onOpenChange={onOpenChange}
			onSubmit={async (values) => {
				const templateId = await copyTemplate({ ...values, sourceTemplateId });
				// Land on the copy — the whole point of duplicating is to edit it.
				router.push(`/quotation-templates/${templateId}`);
			}}
			open={open}
			successTitle="Quotation template duplicated"
			title="Duplicate Quotation Template"
		/>
	);
}
