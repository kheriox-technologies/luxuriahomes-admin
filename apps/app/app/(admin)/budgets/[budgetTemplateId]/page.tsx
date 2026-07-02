import type { Id } from '@workspace/backend/dataModel';
import { Suspense } from 'react';
import BudgetTemplateDetailView from '@/components/budgets/budget-template-detail-view';

export default async function BudgetTemplateDetailPage({
	params,
}: {
	params: Promise<{ budgetTemplateId: string }>;
}) {
	const { budgetTemplateId } = await params;
	return (
		<Suspense fallback={null}>
			<BudgetTemplateDetailView
				budgetTemplateId={budgetTemplateId as Id<'budgetTemplates'>}
			/>
		</Suspense>
	);
}
