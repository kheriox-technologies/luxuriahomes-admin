'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { useQuery } from 'convex/react';
import { ExternalLink } from 'lucide-react';
import { formatAudWhole } from '@/lib/currency';
import { formatIssueDate } from './client-quotation-form-shared';
import { useOpenQuotationPdf } from './use-open-quotation-pdf';

/**
 * The revision history of one quotation, newest first. Mounted only while its
 * accordion row is open, so a long list of quotations doesn't fan out into a
 * query per row.
 */
export default function ClientQuotationVersionsPanel({
	latestVersion,
	quotationId,
}: {
	latestVersion: number;
	quotationId: Id<'clientQuotations'>;
}) {
	const versions = useQuery(api.clientQuotations.listVersions.listVersions, {
		quotationId,
	});
	const openPdf = useOpenQuotationPdf();

	if (versions === undefined) {
		return (
			<p className="px-4 py-3 text-muted-foreground text-sm">
				Loading version history…
			</p>
		);
	}

	return (
		<div className="overflow-x-auto rounded-md border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-24">Version</TableHead>
						<TableHead>Description</TableHead>
						<TableHead className="w-40">Updated by</TableHead>
						<TableHead className="w-36">Updated at</TableHead>
						<TableHead className="w-32 text-right">Total</TableHead>
						<TableHead className="w-28" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{versions.map((version) => (
						<TableRow key={version.version}>
							<TableCell>
								<span className="flex items-center gap-2">
									<span className="font-medium tabular-nums">
										v{version.version}
									</span>
									{version.version === latestVersion ? (
										<Badge variant="secondary">Current</Badge>
									) : null}
								</span>
							</TableCell>
							<TableCell>{version.description}</TableCell>
							<TableCell className="text-muted-foreground">
								{version.updatedBy}
							</TableCell>
							<TableCell className="text-muted-foreground">
								{formatIssueDate(new Date(version.updatedAt))}
							</TableCell>
							<TableCell className="text-right tabular-nums">
								{formatAudWhole(version.totalInclGst)}
							</TableCell>
							<TableCell className="text-right">
								<Button
									disabled={!version.s3Key}
									onClick={() => {
										openPdf(version.s3Key).catch(() => {
											/* handled in openPdf */
										});
									}}
									size="sm"
									type="button"
									variant="outline"
								>
									<ExternalLink aria-hidden /> PDF
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
