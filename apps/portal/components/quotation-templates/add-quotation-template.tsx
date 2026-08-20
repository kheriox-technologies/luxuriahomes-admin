'use client';

import { api } from '@workspace/backend/api';
import { Button } from '@workspace/ui/components/button';
import { useMutation } from 'convex/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import QuotationTemplateDialog from './quotation-template-dialog';

export default function AddQuotationTemplate() {
	const [open, setOpen] = useState(false);
	const addTemplate = useMutation(api.quoteTemplates.add.add);

	return (
		<>
			<Button onClick={() => setOpen(true)} type="button" variant="outline">
				<Plus aria-hidden />
				Add Template
			</Button>
			<QuotationTemplateDialog
				confirmIcon={<Plus aria-hidden />}
				confirmLabel="Add Template"
				errorTitle="Could not add quotation template"
				idPrefix="add-quotation-template"
				onOpenChange={setOpen}
				onSubmit={async (values) => {
					await addTemplate(values);
				}}
				open={open}
				successTitle="Quotation template added"
				title="Add Quotation Template"
			/>
		</>
	);
}
