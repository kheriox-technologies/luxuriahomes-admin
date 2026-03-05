'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
	};

	const isDark = resolvedTheme === 'dark';
	const tooltipText = isDark ? 'Switch to light mode' : 'Switch to dark mode';

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						aria-label={tooltipText}
						onClick={toggleTheme}
						size="icon-sm"
						variant="outline"
					>
						{isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
					</Button>
				}
			/>
			<TooltipPopup>{tooltipText}</TooltipPopup>
		</Tooltip>
	);
}
