import Image from 'next/image';

import { ModeToggle } from '@/components/mode-toggle';

export default function Header() {
	return (
		<header className="flex w-full items-center justify-between border-b px-4 py-3">
			<Image alt="Logo" height={32} priority src="/logo.png" width={120} />
			<ModeToggle />
		</header>
	);
}
