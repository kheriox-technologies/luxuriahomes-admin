import { redirect } from 'next/navigation';

/** The single global catalogue is now one template among many. */
export default function QuotationItemsPage() {
	redirect('/quotation-templates');
}
