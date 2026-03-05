'use client';

import { Button } from '@workspace/ui/components/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
	};

	return (
		<Button onClick={toggleTheme} size="icon" variant="outline">
			<span className="relative inline-block size-[1.2rem]">
				<Sun className="absolute inset-0 m-auto h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute inset-0 m-auto h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			</span>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
