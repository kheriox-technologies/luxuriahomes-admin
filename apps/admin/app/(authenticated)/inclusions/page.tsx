import { redirect } from 'next/navigation';

export default function InclusionsIndexPage() {
	redirect('/inclusions/catalogue' as never);
}
