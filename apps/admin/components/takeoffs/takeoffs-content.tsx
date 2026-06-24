'use client';

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
import {
	Circle,
	Crosshair,
	Hand,
	Hash,
	MousePointer2,
	Pentagon,
	Ruler,
	Square,
	SquareMinus,
} from 'lucide-react';
import {
	type ReactElement,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	circleRadius,
	distance,
	findParentId,
	measure,
	rectArea,
	toMetres,
	translatePoints,
} from '@/lib/takeoffs/geometry';
import type {
	DragKind,
	LengthUnit,
	Measurement,
	MeasurementType,
	Point,
	ToolId,
} from '@/lib/takeoffs/types';
import { AREA_TYPE_SET } from '@/lib/takeoffs/types';
import MeasurementsPanel from './measurements-panel';
import PdfStage from './pdf-stage';
import PdfThumbnails from './pdf-thumbnails';
import { usePdfDocument } from './use-pdf-document';

const PDF_URL = '/sample-plan.pdf';
const UNITS: LengthUnit[] = ['mm', 'cm', 'm'];
// Minimum drag size (base px) before a rectangle/circle is committed; smaller
// drags are treated as an accidental click and discarded.
const MIN_DRAW_PX = 3;

// Human-readable label prefix per measurement type.
const TYPE_LABEL: Record<MeasurementType, string> = {
	linear: 'Linear',
	rectangle: 'Rectangle',
	circle: 'Circle',
	polygon: 'Polygon',
	count: 'Count',
};

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
	{ id: 'select', label: 'Select', icon: MousePointer2 },
	{ id: 'calibrate', label: 'Calibrate', icon: Crosshair },
	{ id: 'linear', label: 'Linear', icon: Ruler, needsCalibration: true },
	{ id: 'rectangle', label: 'Rectangle', icon: Square, needsCalibration: true },
	{ id: 'circle', label: 'Circle', icon: Circle, needsCalibration: true },
	{ id: 'polygon', label: 'Polygon', icon: Pentagon, needsCalibration: true },
	{ id: 'count', label: 'Count', icon: Hash },
];

// Area shapes that can be drawn as a deduction while Subtract mode is on.
const SUBTRACT_SHAPES: {
	icon: typeof Hand;
	id: MeasurementType;
	label: string;
}[] = [
	{ id: 'rectangle', label: 'Rectangle', icon: Square },
	{ id: 'circle', label: 'Circle', icon: Circle },
	{ id: 'polygon', label: 'Polygon', icon: Pentagon },
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
	const { numPages, renderPage, renderThumbnail, error, ready } =
		usePdfDocument(PDF_URL);

	const [page, setPage] = useState(1);
	const [tool, setTool] = useState<ToolId>('pan');
	// When on, area shapes are drawn as deductions of the parent that contains
	// them; `subtractShape` is which area shape the selector draws.
	const [subtractMode, setSubtractMode] = useState(false);
	const [subtractShape, setSubtractShape] =
		useState<MeasurementType>('rectangle');
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
	// Currently selected committed shape (Select tool) for editing/move.
	const [selectedId, setSelectedId] = useState<string | null>(null);
	// Mirrors `draft` synchronously so rapid clicks accumulate correctly even
	// before React re-renders (state reads in handlers would otherwise be stale).
	const draftRef = useRef<Point[]>([]);
	// Active pointer drag (draw / move / resize). Ref-driven like `draftRef` so
	// native SVG listeners read the latest value without stale closures.
	const dragRef = useRef<DragKind | null>(null);
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
			// Picking from the main tool row means normal (non-deduction) drawing.
			setSubtractMode(false);
			resetDraft();
			setSelectedId(null);
		},
		[resetDraft]
	);

	// Turn Subtract mode on/off. Turning it on switches to the chosen area shape so
	// the user can immediately draw deductions.
	const toggleSubtract = useCallback(() => {
		setSubtractMode((on) => {
			const next = !on;
			if (next) {
				setTool(subtractShape);
			}
			return next;
		});
		resetDraft();
		setSelectedId(null);
	}, [subtractShape, resetDraft]);

	// Pick which area shape the subtract selector draws (also makes it active).
	const selectSubtractShape = useCallback(
		(shape: MeasurementType) => {
			setSubtractShape(shape);
			setTool(shape);
			resetDraft();
			setSelectedId(null);
		},
		[resetDraft]
	);

	const goToPage = useCallback(
		(next: number) => {
			setPage(() => Math.min(Math.max(next, 1), numPages || 1));
			resetDraft();
			setSelectedId(null);
		},
		[numPages, resetDraft]
	);

	// Replace a committed shape's points and recompute its value/perimeter live.
	const updateMeasurementPoints = useCallback(
		(id: string, points: Point[]) => {
			setMeasurements((prev) =>
				prev.map((m) =>
					m.id === id
						? {
								...m,
								points,
								...(metersPerPixel
									? measure(m.type, points, metersPerPixel)
									: {}),
							}
						: m
				)
			);
		},
		[metersPerPixel]
	);

	const commit = useCallback(
		(type: MeasurementType, points: Point[]) => {
			if (!metersPerPixel) {
				return;
			}
			setMeasurements((prev) => {
				// In subtract mode, attach the new area shape to the parent that
				// contains it; if none contains it, it commits as a normal area.
				const parentId =
					subtractMode && AREA_TYPE_SET.has(type)
						? findParentId({ type, points }, prev, page)
						: undefined;
				const label = parentId
					? `Deduction ${prev.filter((m) => m.parentId).length + 1}`
					: `${TYPE_LABEL[type]} ${
							prev.filter((m) => m.type === type && !m.parentId).length + 1
						}`;
				return [
					...prev,
					{
						id: crypto.randomUUID(),
						page,
						type,
						points,
						...measure(type, points, metersPerPixel),
						parentId,
						label,
					},
				];
			});
		},
		[page, metersPerPixel, subtractMode]
	);

	const finishDraft = useCallback(() => {
		const points = dedupeConsecutive(draftRef.current);
		if (tool === 'linear' && points.length >= 2) {
			commit('linear', points);
		} else if (tool === 'polygon' && points.length >= 3) {
			commit('polygon', points);
		} else if (
			tool === 'rectangle' &&
			points.length >= 2 &&
			rectArea(points) > MIN_DRAW_PX ** 2
		) {
			commit('rectangle', points);
		} else if (
			tool === 'circle' &&
			points.length >= 2 &&
			circleRadius(points) >= MIN_DRAW_PX
		) {
			commit('circle', points);
		}
		writeDraft([]);
		setCursor(null);
	}, [tool, commit, writeDraft]);

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

			if (tool === 'linear' || tool === 'polygon') {
				writeDraft([...draftRef.current, point]);
			}
		},
		[tool, page, documentCalibration, writeDraft]
	);

	// A pointer drag has begun (rectangle/circle draw, or move/resize of a
	// committed shape via the Select tool). Hit-testing happens in PdfStage,
	// which has the page scale; here we just record the drag and select.
	const handleDragStart = useCallback(
		(drag: DragKind) => {
			dragRef.current = drag;
			if (drag.mode === 'draw-rect' || drag.mode === 'draw-circle') {
				writeDraft([drag.start]);
			} else {
				setSelectedId(drag.id);
			}
		},
		[writeDraft]
	);

	// Pointer moved. Apply the active drag live, or update the draft cursor for
	// multi-click tools (linear/polygon/calibrate).
	const handleCursorMove = useCallback(
		(point: Point | null) => {
			const drag = dragRef.current;
			if (drag && point) {
				if (drag.mode === 'draw-rect' || drag.mode === 'draw-circle') {
					writeDraft([drag.start, point]);
				} else if (drag.mode === 'move') {
					const dx = point.x - drag.start.x;
					const dy = point.y - drag.start.y;
					updateMeasurementPoints(drag.id, translatePoints(drag.orig, dx, dy));
					// Move the parent's deductions along with it.
					for (const child of drag.children ?? []) {
						updateMeasurementPoints(
							child.id,
							translatePoints(child.orig, dx, dy)
						);
					}
				} else {
					updateMeasurementPoints(
						drag.id,
						drag.orig.map((p, i) => (i === drag.index ? point : p))
					);
				}
				return;
			}
			if (tool === 'linear' || tool === 'polygon' || tool === 'calibrate') {
				setCursor(point);
			}
		},
		[tool, writeDraft, updateMeasurementPoints]
	);

	// Pointer released — commit a rectangle/circle draw; move/resize already
	// applied live, so just clear the drag.
	const handlePointerUp = useCallback(() => {
		const drag = dragRef.current;
		dragRef.current = null;
		if (drag?.mode === 'draw-rect' || drag?.mode === 'draw-circle') {
			finishDraft();
		}
	}, [finishDraft]);

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

	const deleteMeasurement = useCallback((id: string) => {
		// Deleting a parent also removes its deductions.
		setMeasurements((prev) =>
			prev.filter((m) => m.id !== id && m.parentId !== id)
		);
		setSelectedId((current) => (current === id ? null : current));
	}, []);

	// Keyboard shortcuts for drawing and editing.
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (calibLine) {
				return;
			}
			const editingSelection =
				tool === 'select' &&
				selectedId !== null &&
				draftRef.current.length === 0;
			if (event.key === 'Enter') {
				finishDraft();
			} else if (event.key === 'Escape') {
				resetDraft();
				setSelectedId(null);
			} else if (
				(event.key === 'Delete' || event.key === 'Backspace') &&
				editingSelection
			) {
				event.preventDefault();
				deleteMeasurement(selectedId);
			} else if (event.key === 'Backspace' && draftRef.current.length > 0) {
				event.preventDefault();
				writeDraft(draftRef.current.slice(0, -1));
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [
		finishDraft,
		resetDraft,
		writeDraft,
		calibLine,
		tool,
		selectedId,
		deleteMeasurement,
	]);

	const canFinish =
		(tool === 'linear' && draft.length >= 2) ||
		(tool === 'polygon' && draft.length >= 3);

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

				<div className="flex items-center gap-1 rounded-lg border bg-card p-1">
					<Button
						disabled={!isCalibrated}
						onClick={toggleSubtract}
						size="sm"
						title={
							isCalibrated
								? 'Subtract shapes from the parent they sit inside'
								: 'Calibrate this page first'
						}
						variant={subtractMode ? 'default' : 'ghost'}
					>
						<SquareMinus />
						Subtract
					</Button>
					{subtractMode &&
						SUBTRACT_SHAPES.map((shape) => {
							const Icon = shape.icon;
							return (
								<Button
									key={shape.id}
									onClick={() => selectSubtractShape(shape.id)}
									size="sm"
									title={shape.label}
									variant={subtractShape === shape.id ? 'default' : 'ghost'}
								>
									<Icon />
									{shape.label}
								</Button>
							);
						})}
				</div>

				{canFinish && (
					<Button onClick={finishDraft} size="sm" variant="secondary">
						Finish
					</Button>
				)}

				<span className="ml-auto text-muted-foreground text-xs">
					Scroll to zoom · Select to edit/move · Enter/Esc to finish/cancel
				</span>
			</div>

			<div className="flex min-h-0 flex-1 gap-3">
				<PdfThumbnails
					currentPage={page}
					numPages={numPages}
					onSelectPage={goToPage}
					ready={ready}
					renderThumbnail={renderThumbnail}
				/>
				<div className="min-w-0 flex-1">
					<PdfStage
						cursor={cursor}
						draft={draft}
						error={error}
						measurements={measurements.filter((m) => m.page === page)}
						metersPerPixel={metersPerPixel}
						numPages={numPages}
						onCursorMove={handleCursorMove}
						onDragStart={handleDragStart}
						onPointerUp={handlePointerUp}
						onSelectShape={setSelectedId}
						onStageClick={handleStageClick}
						onStageDoubleClick={finishDraft}
						page={page}
						ready={ready}
						renderPage={renderPage}
						selectedId={selectedId}
						tool={tool}
					/>
				</div>

				<MeasurementsPanel
					calibrated={isCalibrated}
					measurements={measurements}
					metersPerPixel={metersPerPixel}
					onClearAll={() => {
						setMeasurements([]);
						resetDraft();
						setSelectedId(null);
					}}
					onClearPage={() => {
						setMeasurements((prev) => prev.filter((m) => m.page !== page));
						resetDraft();
						setSelectedId(null);
					}}
					onDelete={deleteMeasurement}
					onUsePdfScale={
						pageOverride === null
							? undefined
							: () =>
									setPageCalibrations((prev) => {
										const next = { ...prev };
										delete next[page];
										return next;
									})
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
