import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';

export default function Header() {
	return (
		<header className="flex w-full items-center justify-between border-b px-4 py-3">
			<Image alt="Logo" height={32} priority src="/logo.png" width={120} />
			<div className="flex items-center gap-4">
				<UserButton />
			</div>
		</header>
	);
}
