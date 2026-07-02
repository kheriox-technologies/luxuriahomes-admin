'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';
import { CalculatorIcon, CheckIcon, CopyIcon, DeleteIcon } from 'lucide-react';
import { type KeyboardEvent, useEffect, useState } from 'react';

type Operator = '+' | '-' | '×' | '÷';

const ERROR = 'Error';
// Round results to tame binary-float noise (e.g. 0.1 + 0.2) while keeping
// enough precision for takeoff arithmetic.
const PRECISION = 8;
const COPIED_RESET_MS = 1500;

function applyOperator(a: number, b: number, operator: Operator): number {
	switch (operator) {
		case '+':
			return a + b;
		case '-':
			return a - b;
		case '×':
			return a * b;
		case '÷':
			return b === 0 ? Number.NaN : a / b;
		default:
			return b;
	}
}

function formatNumber(value: number): string {
	if (!Number.isFinite(value)) {
		return ERROR;
	}
	return String(Number(value.toFixed(PRECISION)));
}

export default function CalculatorPopover() {
	const [display, setDisplay] = useState('0');
	const [previous, setPrevious] = useState<number | null>(null);
	const [operator, setOperator] = useState<Operator | null>(null);
	// When true, the next digit starts a fresh entry (after an operator or `=`).
	const [overwrite, setOverwrite] = useState(true);
	// The "2 × 4" string frozen at the moment `=` was pressed, shown above the
	// result until the next input clears it.
	const [evaluated, setEvaluated] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) {
			return;
		}
		const timer = setTimeout(() => setCopied(false), COPIED_RESET_MS);
		return () => clearTimeout(timer);
	}, [copied]);

	const reset = () => {
		setDisplay('0');
		setPrevious(null);
		setOperator(null);
		setOverwrite(true);
		setEvaluated(null);
	};

	const inputDigit = (digit: string) => {
		setEvaluated(null);
		if (overwrite || display === ERROR) {
			setDisplay(digit);
			setOverwrite(false);
			return;
		}
		setDisplay(display === '0' ? digit : display + digit);
	};

	const inputDot = () => {
		setEvaluated(null);
		if (overwrite || display === ERROR) {
			setDisplay('0.');
			setOverwrite(false);
			return;
		}
		if (!display.includes('.')) {
			setDisplay(`${display}.`);
		}
	};

	const negate = () => {
		if (display === ERROR || display === '0') {
			return;
		}
		setEvaluated(null);
		setDisplay(display.startsWith('-') ? display.slice(1) : `-${display}`);
	};

	const percent = () => {
		if (display === ERROR) {
			return;
		}
		setEvaluated(null);
		const value = Number(display);
		// For +/-, percent is taken of the left operand (200 + 10% → +20).
		// Otherwise it's a plain fraction (200 × 15% → ×0.15).
		const isAdditive = operator === '+' || operator === '-';
		const percentValue =
			previous !== null && isAdditive ? (previous * value) / 100 : value / 100;
		// Keep this as the active operand so the pending operation still applies.
		setDisplay(formatNumber(percentValue));
		setOverwrite(false);
	};

	const backspace = () => {
		if (overwrite || display === ERROR) {
			return;
		}
		setEvaluated(null);
		const next = display.slice(0, -1);
		setDisplay(next === '' || next === '-' ? '0' : next);
	};

	const chooseOperator = (next: Operator) => {
		if (display === ERROR) {
			return;
		}
		setEvaluated(null);
		const current = Number(display);
		if (previous !== null && operator && !overwrite) {
			const result = applyOperator(previous, current, operator);
			setDisplay(formatNumber(result));
			setPrevious(Number.isFinite(result) ? result : null);
		} else {
			setPrevious(current);
		}
		setOperator(next);
		setOverwrite(true);
	};

	const equals = () => {
		if (previous === null || operator === null || display === ERROR) {
			return;
		}
		const result = applyOperator(previous, Number(display), operator);
		setEvaluated(`${formatNumber(previous)} ${operator} ${display}`);
		setDisplay(formatNumber(result));
		setPrevious(null);
		setOperator(null);
		setOverwrite(true);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const { key } = event;
		if (key >= '0' && key <= '9') {
			inputDigit(key);
		} else if (key === '.') {
			inputDot();
		} else if (key === '+' || key === '-') {
			chooseOperator(key);
		} else if (key === '*') {
			chooseOperator('×');
		} else if (key === '/') {
			event.preventDefault();
			chooseOperator('÷');
		} else if (key === '%') {
			percent();
		} else if (key === 'Enter' || key === '=') {
			event.preventDefault();
			equals();
		} else if (key === 'Backspace') {
			backspace();
		}
	};

	const handleCopy = async () => {
		if (result === ERROR) {
			return;
		}
		try {
			await navigator.clipboard.writeText(result);
			setCopied(true);
		} catch {
			// Clipboard unavailable (e.g. denied permission) — nothing to do.
		}
	};

	// The full expression shown in the input line.
	const buildExpression = (): string => {
		if (evaluated !== null) {
			return evaluated;
		}
		if (operator && previous !== null) {
			const left = formatNumber(previous);
			return overwrite
				? `${left} ${operator}`
				: `${left} ${operator} ${display}`;
		}
		return display;
	};

	// The live result shown below the input line.
	const computeResult = (): string => {
		if (display === ERROR) {
			return ERROR;
		}
		if (operator && previous !== null && !overwrite) {
			return formatNumber(applyOperator(previous, Number(display), operator));
		}
		return formatNumber(Number(display));
	};

	const expression = buildExpression();
	const result = computeResult();

	const digitClass = 'h-8 text-sm';

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						aria-label="Calculator"
						size="icon-sm"
						title="Calculator"
						variant="outline"
					>
						<CalculatorIcon />
					</Button>
				}
			/>
			<PopoverContent align="end" className="w-60" onKeyDown={handleKeyDown}>
				<div className="flex flex-col gap-2">
					{/* Input line: the full expression, e.g. "2 × 4". */}
					<output className="block min-h-5 truncate rounded-md border bg-muted/40 px-2.5 py-1 text-right text-sm tabular-nums">
						{expression}
					</output>
					{/* Result line with a copy button. */}
					<div className="flex items-center gap-1 rounded-md border bg-muted/40 px-1.5 py-1">
						<Button
							aria-label="Copy result"
							disabled={result === ERROR}
							onClick={handleCopy}
							size="icon-xs"
							title="Copy result"
							type="button"
							variant="ghost"
						>
							{copied ? <CheckIcon /> : <CopyIcon />}
						</Button>
						<output
							className={cn(
								'min-w-0 flex-1 truncate text-right font-semibold text-lg tabular-nums',
								result === ERROR && 'text-destructive'
							)}
						>
							{result}
						</output>
					</div>
					<div className="grid grid-cols-4 gap-1.5">
						<Button
							className={digitClass}
							onClick={reset}
							type="button"
							variant="secondary"
						>
							C
						</Button>
						<Button
							className={digitClass}
							onClick={negate}
							type="button"
							variant="secondary"
						>
							±
						</Button>
						<Button
							className={digitClass}
							onClick={percent}
							type="button"
							variant="secondary"
						>
							%
						</Button>
						<Button
							className={digitClass}
							onClick={() => chooseOperator('÷')}
							type="button"
							variant="default"
						>
							÷
						</Button>

						{['7', '8', '9'].map((digit) => (
							<Button
								className={digitClass}
								key={digit}
								onClick={() => inputDigit(digit)}
								type="button"
								variant="outline"
							>
								{digit}
							</Button>
						))}
						<Button
							className={digitClass}
							onClick={() => chooseOperator('×')}
							type="button"
							variant="default"
						>
							×
						</Button>

						{['4', '5', '6'].map((digit) => (
							<Button
								className={digitClass}
								key={digit}
								onClick={() => inputDigit(digit)}
								type="button"
								variant="outline"
							>
								{digit}
							</Button>
						))}
						<Button
							className={digitClass}
							onClick={() => chooseOperator('-')}
							type="button"
							variant="default"
						>
							−
						</Button>

						{['1', '2', '3'].map((digit) => (
							<Button
								className={digitClass}
								key={digit}
								onClick={() => inputDigit(digit)}
								type="button"
								variant="outline"
							>
								{digit}
							</Button>
						))}
						<Button
							className={digitClass}
							onClick={() => chooseOperator('+')}
							type="button"
							variant="default"
						>
							+
						</Button>

						<Button
							aria-label="Backspace"
							className={digitClass}
							onClick={backspace}
							type="button"
							variant="outline"
						>
							<DeleteIcon />
						</Button>
						<Button
							className={digitClass}
							onClick={() => inputDigit('0')}
							type="button"
							variant="outline"
						>
							0
						</Button>
						<Button
							className={digitClass}
							onClick={inputDot}
							type="button"
							variant="outline"
						>
							.
						</Button>
						<Button
							className={digitClass}
							onClick={equals}
							type="button"
							variant="default"
						>
							=
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
