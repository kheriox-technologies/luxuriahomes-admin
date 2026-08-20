'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import { Pencil } from 'lucide-react';
import QuotationTemplateDialog from './quotation-template-dialog';

export default function EditQuotationTemplate({
	initialDescription,
	initialName,
	onOpenChange,
	open,
	templateId,
}: {
	initialDescription?: string;
	initialName: string;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	templateId: Id<'quoteTemplates'>;
}) {
	const updateTemplate = useMutation(api.quoteTemplates.update.update);

	return (
		<QuotationTemplateDialog
			confirmIcon={<Pencil aria-hidden />}
			confirmLabel="Save Changes"
			errorTitle="Could not update quotation template"
			idPrefix={`edit-quotation-template-${templateId}`}
			initialDescription={initialDescription}
			initialName={initialName}
			onOpenChange={onOpenChange}
			onSubmit={async (values) => {
				await updateTemplate({ ...values, templateId });
			}}
			open={open}
			successTitle="Quotation template updated"
			title="Edit Quotation Template"
		/>
	);
}
