import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '@workspace/ui/components/alert';
import { Badge } from '@workspace/ui/components/badge';
import { TriangleAlert } from 'lucide-react';

// Shared warning banner listing Xero accounts that aren't mapped to a trade,
// each shown as a `code — name` badge. Used by the project Budgets tab (codes
// with project spend) and the Trades list page (any account with no trade).
export function UnmappedXeroCodesAlert({
	title,
	description,
	codes,
}: {
	title: string;
	description: string;
	codes: { id: string; code: string; name: string }[];
}) {
	if (codes.length === 0) {
		return null;
	}
	return (
		<Alert variant="warning">
			<TriangleAlert />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>
				<span>{description}</span>
				<div className="flex flex-wrap gap-2">
					{codes.map((code) => (
						<Badge key={code.id} size="lg" variant="warning">
							{code.code ? `${code.code} — ${code.name}` : code.name}
						</Badge>
					))}
				</div>
			</AlertDescription>
		</Alert>
	);
}
