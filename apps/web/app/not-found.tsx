import { Button } from '@workspace/ui/components/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<section className="flex min-h-[60vh] items-center justify-center bg-brand-navy px-6 py-24">
			<div className="flex max-w-md flex-col items-center gap-6 text-center">
				<span className="eyebrow eyebrow--cream">Error 404</span>
				<h1 className="font-display text-4xl text-white sm:text-5xl">
					Page not found
				</h1>
				<p className="text-white/70 leading-relaxed">
					The page you’re looking for may have moved or no longer exists. Let’s
					get you back home.
				</p>
				<Button
					className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90"
					render={<Link href="/" />}
					size="lg"
				>
					<ArrowLeft />
					Back to Home
				</Button>
			</div>
		</section>
	);
}
