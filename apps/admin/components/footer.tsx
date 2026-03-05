import { env } from '@workspace/env/admin';

export default function Footer() {
	return (
		<footer className="flex w-full items-center justify-center px-4 py-3">
			<p className="text-muted-foreground text-sm">
				&copy; {new Date().getFullYear()} {env.NEXT_PUBLIC_FOOTER_TEXT}
			</p>
		</footer>
	);
}
