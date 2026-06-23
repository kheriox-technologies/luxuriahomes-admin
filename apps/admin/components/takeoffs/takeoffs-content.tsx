'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import {
	ChevronLeft,
	ChevronRight,
	Crosshair,
	Hand,
	Hash,
	Ruler,
	Shapes,
} from 'lucide-react';
import {
	type ReactElement,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	distance,
	polygonArea,
	polygonPerimeter,
	polylineLength,
	toMetres,
} from '@/lib/takeoffs/geometry';
import type {
	LengthUnit,
	Measurement,
	Point,
	ToolId,
} from '@/lib/takeoffs/types';
import MeasurementsPanel from './measurements-panel';
import PdfStage from './pdf-stage';
import { usePdfDocument } from './use-pdf-document';

const PDF_URL = '/sample-plan.pdf';
const UNITS: LengthUnit[] = ['mm', 'cm', 'm'];

// Whether a calibration sets the PDF-wide default or overrides a single page.
type CalibScope = 'all' | 'page';

interface ToolDef {
	icon: typeof Hand;
	id: ToolId;
	label: string;
	needsCalibration?: boolean;
}

const TOOLS: ToolDef[] = [
	{ id: 'pan', label: 'Pan', icon: Hand },
	{ id: 'calibrate', label: 'Calibrate', icon: Crosshair },
	{ id: 'linear', label: 'Linear', icon: Ruler, needsCalibration: true },
	{ id: 'area', label: 'Area', icon: Shapes, needsCalibration: true },
	{ id: 'count', label: 'Count', icon: Hash },
];

function dedupeConsecutive(points: Point[]): Point[] {
	const result: Point[] = [];
	for (const p of points) {
		const last = result.at(-1);
		if (!last || distance(last, p) > 0.5) {
			result.push(p);
		}
	}
	return result;
}

export default function TakeoffsContent() {
	const { numPages, renderPage, error, ready } = usePdfDocument(PDF_URL);

	const [page, setPage] = useState(1);
	const [tool, setTool] = useState<ToolId>('pan');
	const [measurements, setMeasurements] = useState<Measurement[]>([]);
	// PDF-wide default scale, plus optional per-page overrides.
	const [documentCalibration, setDocumentCalibration] = useState<number | null>(
		null
	);
	const [pageCalibrations, setPageCalibrations] = useState<
		Record<number, number>
	>({});
	const [draft, setDraft] = useState<Point[]>([]);
	const [cursor, setCursor] = useState<Point | null>(null);
	// Mirrors `draft` synchronously so rapid clicks accumulate correctly even
	// before React re-renders (state reads in handlers would otherwise be stale).
	const draftRef = useRef<Point[]>([]);
	const writeDraft = useCallback((points: Point[]) => {
		draftRef.current = points;
		setDraft(points);
	}, []);

	// Calibration dialog state.
	const [calibLine, setCalibLine] = useState<[Point, Point] | null>(null);
	const [calibValue, setCalibValue] = useState('');
	const [calibUnit, setCalibUnit] = useState<LengthUnit>('mm');
	const [calibScope, setCalibScope] = useState<CalibScope>('all');

	const pageOverride = pageCalibrations[page] ?? null;
	const metersPerPixel = pageOverride ?? documentCalibration;
	const isCalibrated = metersPerPixel !== null;

	const resetDraft = useCallback(() => {
		writeDraft([]);
		setCursor(null);
	}, [writeDraft]);

	const selectTool = useCallback(
		(next: ToolId) => {
			setTool(next);
			resetDraft();
		},
		[resetDraft]
	);

	const changePage = useCallback(
		(delta: number) => {
			setPage((prev) => {
				const next = prev + delta;
				if (next < 1 || (numPages && next > numPages)) {
					return prev;
				}
				return next;
			});
			resetDraft();
		},
		[numPages, resetDraft]
	);

	const finishDraft = useCallback(() => {
		const points = dedupeConsecutive(draftRef.current);
		if (tool === 'linear' && points.length >= 2 && metersPerPixel) {
			setMeasurements((prev) => [
				...prev,
				{
					id: crypto.randomUUID(),
					page,
					type: 'linear',
					points,
					valueMeters: polylineLength(points) * metersPerPixel,
					label: `Linear ${prev.filter((m) => m.type === 'linear').length + 1}`,
				},
			]);
		} else if (tool === 'area' && points.length >= 3 && metersPerPixel) {
			setMeasurements((prev) => [
				...prev,
				{
					id: crypto.randomUUID(),
					page,
					type: 'area',
					points,
					valueSqm: polygonArea(points) * metersPerPixel ** 2,
					perimeterMeters: polygonPerimeter(points) * metersPerPixel,
					label: `Area ${prev.filter((m) => m.type === 'area').length + 1}`,
				},
			]);
		}
		writeDraft([]);
		setCursor(null);
	}, [tool, page, metersPerPixel, writeDraft]);

	const handleStageClick = useCallback(
		(point: Point) => {
			if (tool === 'count') {
				setMeasurements((prev) => {
					const existing = prev.find(
						(m) => m.type === 'count' && m.page === page
					);
					if (existing) {
						return prev.map((m) =>
							m.id === existing.id
								? {
										...m,
										points: [...m.points, point],
										count: m.points.length + 1,
									}
								: m
						);
					}
					return [
						...prev,
						{
							id: crypto.randomUUID(),
							page,
							type: 'count',
							points: [point],
							count: 1,
							label: 'Count',
						},
					];
				});
				return;
			}

			if (tool === 'calibrate') {
				const next = [...draftRef.current, point];
				if (next.length === 2) {
					setCalibLine([next[0], next[1]]);
					// Default scope: PDF-wide the first time, page override afterwards.
					setCalibScope(documentCalibration === null ? 'all' : 'page');
					writeDraft([]);
				} else {
					writeDraft(next);
				}
				return;
			}

			if (tool === 'linear' || tool === 'area') {
				writeDraft([...draftRef.current, point]);
			}
		},
		[tool, page, documentCalibration, writeDraft]
	);

	const confirmCalibration = useCallback(() => {
		if (!calibLine) {
			return;
		}
		const realMeters = toMetres(Number(calibValue), calibUnit);
		const pixels = distance(calibLine[0], calibLine[1]);
		if (realMeters > 0 && pixels > 0) {
			const mpp = realMeters / pixels;
			if (calibScope === 'all') {
				// Set the PDF-wide default and drop this page's override so it follows it.
				setDocumentCalibration(mpp);
				setPageCalibrations((prev) => {
					const next = { ...prev };
					delete next[page];
					return next;
				});
			} else {
				setPageCalibrations((prev) => ({ ...prev, [page]: mpp }));
			}
		}
		setCalibLine(null);
		setCalibValue('');
	}, [calibLine, calibValue, calibUnit, calibScope, page]);

	// Keyboard shortcuts for drawing.
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (calibLine) {
				return;
			}
			if (event.key === 'Enter') {
				finishDraft();
			} else if (event.key === 'Escape') {
				resetDraft();
			} else if (event.key === 'Backspace' && draftRef.current.length > 0) {
				event.preventDefault();
				writeDraft(draftRef.current.slice(0, -1));
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [finishDraft, resetDraft, writeDraft, calibLine]);

	const canFinish =
		(tool === 'linear' && draft.length >= 2) ||
		(tool === 'area' && draft.length >= 3);

	return (
		<div className="flex h-full min-h-0 w-full flex-col gap-3">
			<div className="flex flex-wrap items-center gap-2">
				<div className="flex items-center gap-1 rounded-lg border bg-card p-1">
					{TOOLS.map((toolDef) => {
						const Icon = toolDef.icon;
						const disabled = toolDef.needsCalibration && !isCalibrated;
						return (
							<Button
								disabled={disabled}
								key={toolDef.id}
								onClick={() => selectTool(toolDef.id)}
								size="sm"
								title={disabled ? 'Calibrate this page first' : toolDef.label}
								variant={tool === toolDef.id ? 'default' : 'ghost'}
							>
								<Icon />
								{toolDef.label}
							</Button>
						);
					})}
				</div>

				<Separator className="h-6" orientation="vertical" />

				<div className="flex items-center gap-1">
					<Button
						aria-label="Previous page"
						disabled={page <= 1}
						onClick={() => changePage(-1)}
						size="icon-sm"
						variant="outline"
					>
						<ChevronLeft />
					</Button>
					<span className="min-w-16 text-center text-sm tabular-nums">
						{page} / {numPages || '–'}
					</span>
					<Button
						aria-label="Next page"
						disabled={Boolean(numPages) && page >= numPages}
						onClick={() => changePage(1)}
						size="icon-sm"
						variant="outline"
					>
						<ChevronRight />
					</Button>
				</div>

				<Separator className="h-6" orientation="vertical" />

				<Badge size="lg" variant={isCalibrated ? 'success' : 'warning'}>
					{isCalibrated
						? `1 px = ${(metersPerPixel * 1000).toFixed(2)} mm · ${
								pageOverride === null ? 'all pages' : 'this page'
							}`
						: 'Not calibrated'}
				</Badge>
				{pageOverride !== null && (
					<Button
						onClick={() =>
							setPageCalibrations((prev) => {
								const next = { ...prev };
								delete next[page];
								return next;
							})
						}
						size="sm"
						variant="ghost"
					>
						Use PDF scale
					</Button>
				)}

				{canFinish && (
					<Button onClick={finishDraft} size="sm" variant="secondary">
						Finish
					</Button>
				)}

				<span className="ml-auto text-muted-foreground text-xs">
					Scroll to zoom · Pan tool to drag · Enter/Esc to finish/cancel
				</span>
			</div>

			<div className="flex min-h-0 flex-1 gap-3">
				<div className="min-w-0 flex-1">
					<PdfStage
						cursor={cursor}
						draft={draft}
						error={error}
						measurements={measurements.filter((m) => m.page === page)}
						metersPerPixel={metersPerPixel}
						numPages={numPages}
						onCursorMove={setCursor}
						onStageClick={handleStageClick}
						onStageDoubleClick={finishDraft}
						page={page}
						ready={ready}
						renderPage={renderPage}
						tool={tool}
					/>
				</div>

				<MeasurementsPanel
					calibrated={isCalibrated}
					measurements={measurements}
					onClearAll={() => {
						setMeasurements([]);
						resetDraft();
					}}
					onClearPage={() => {
						setMeasurements((prev) => prev.filter((m) => m.page !== page));
						resetDraft();
					}}
					onDelete={(id) =>
						setMeasurements((prev) => prev.filter((m) => m.id !== id))
					}
					page={page}
				/>
			</div>

			<CalibrationDialog
				onCancel={() => {
					setCalibLine(null);
					setCalibValue('');
				}}
				onConfirm={confirmCalibration}
				onScopeChange={setCalibScope}
				onUnitChange={setCalibUnit}
				onValueChange={setCalibValue}
				open={calibLine !== null}
				page={page}
				scope={calibScope}
				unit={calibUnit}
				value={calibValue}
			/>
		</div>
	);
}

function CalibrationDialog({
	open,
	value,
	unit,
	scope,
	page,
	onValueChange,
	onUnitChange,
	onScopeChange,
	onConfirm,
	onCancel,
}: {
	open: boolean;
	value: string;
	unit: LengthUnit;
	scope: CalibScope;
	page: number;
	onValueChange: (value: string) => void;
	onUnitChange: (unit: LengthUnit) => void;
	onScopeChange: (scope: CalibScope) => void;
	onConfirm: () => void;
	onCancel: () => void;
}): ReactElement {
	const scopeOptions: Array<{ id: CalibScope; label: string }> = [
		{ id: 'all', label: 'All pages' },
		{ id: 'page', label: `This page only (${page})` },
	];
	return (
		<Dialog
			onOpenChange={(next) => {
				if (!next) {
					onCancel();
				}
			}}
			open={open}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Set scale from known dimension</DialogTitle>
					<DialogDescription>
						Enter the real-world length of the line you just drew, then choose
						whether this scale applies to the whole PDF or just this page.
					</DialogDescription>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Input
							autoFocus
							nativeInput
							onChange={(event) => onValueChange(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									onConfirm();
								}
							}}
							placeholder="e.g. 5000"
							type="number"
							value={value}
						/>
						<div className="flex items-center gap-1 rounded-lg border p-1">
							{UNITS.map((u) => (
								<Button
									key={u}
									onClick={() => onUnitChange(u)}
									size="sm"
									variant={unit === u ? 'default' : 'ghost'}
								>
									{u}
								</Button>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-1.5">
						<span className="font-medium text-muted-foreground text-xs">
							Apply scale to
						</span>
						<div className="flex items-center gap-1 rounded-lg border p-1">
							{scopeOptions.map((option) => (
								<Button
									className="flex-1"
									key={option.id}
									onClick={() => onScopeChange(option.id)}
									size="sm"
									variant={scope === option.id ? 'default' : 'ghost'}
								>
									{option.label}
								</Button>
							))}
						</div>
					</div>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={!value || Number(value) <= 0}
						onClick={onConfirm}
						type="button"
					>
						Set scale
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
