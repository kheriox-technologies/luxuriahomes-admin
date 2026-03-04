import { env } from '@repo/env/web';

import { ModeToggle } from '@/components/mode-toggle';

export default function Header() {
	return (
		<header className="flex w-full items-center justify-between border-b px-4 py-3">
			<h1 className="font-semibold text-xl">{env.NEXT_PUBLIC_APP_NAME}</h1>
			<ModeToggle />
		</header>
	);
}
