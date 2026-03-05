import { UserButton } from '@clerk/nextjs';
import { Separator } from '@workspace/ui/components/separator';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';

export default function Header() {
	return (
		<header className="flex w-full items-center justify-between border-b px-4 py-3">
			<Link href="/">
				<Image alt="Logo" height={32} priority src="/logo.png" width={120} />
			</Link>
			<div className="flex items-center gap-4">
				<ModeToggle />
				<Separator orientation="vertical" />
				<UserButton />
			</div>
		</header>
	);
}
