import {
	CoreBridge,
	PlaceholderBridge,
	RichText,
	TenTapStartKit,
	Toolbar,
	useEditorBridge,
	useEditorContent,
} from '@10play/tentap-editor';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

const DEFAULT_MIN_HEIGHT = 220;

// TenTap's editor body (`.ProseMirror`) ships with no padding, so text sits
// flush against the WebView edges. Match the other fields' horizontal inset
// (px-3 = 12px) with a little vertical breathing room.
const EDITOR_CONTENT_CSS = '.ProseMirror { padding: 8px 12px; }';

/**
 * A labelled rich-text editor backed by TenTap (Tiptap in a WebView). It emits
 * the same HTML tag vocabulary as the portal's Tiptap `RichTextEditor`, so the
 * content round-trips through the server-side html→pdfmake converter and stays
 * editable in the portal. The toolbar (bold/italic/underline/lists/link/…) sits
 * above the editor, mirroring the portal's per-editor toolbar.
 */
export function RichTextField({
	label,
	initialContent,
	onChange,
	placeholder,
	minHeight = DEFAULT_MIN_HEIGHT,
	className,
}: {
	label: string;
	initialContent: string;
	onChange: (html: string) => void;
	placeholder?: string;
	minHeight?: number;
	className?: string;
}) {
	const editor = useEditorBridge({
		autofocus: false,
		avoidIosKeyboard: true,
		initialContent,
		bridgeExtensions: [
			...TenTapStartKit,
			// Overrides the same-named bridge from the start kit (last wins).
			CoreBridge.configureCSS(EDITOR_CONTENT_CSS),
			...(placeholder
				? [PlaceholderBridge.configureExtension({ placeholder })]
				: []),
		],
	});

	const html = useEditorContent(editor, { type: 'html' });

	// Keep the latest onChange without re-subscribing; forward each HTML update
	// to the parent form once the editor has produced content.
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;
	useEffect(() => {
		if (html !== undefined) {
			onChangeRef.current(html);
		}
	}, [html]);

	return (
		<View className={cn('gap-1.5', className)}>
			<Text className="font-sans-medium text-foreground text-sm">{label}</Text>
			<View className="overflow-hidden rounded-lg border border-border bg-white">
				<Toolbar editor={editor} />
				<View style={{ height: minHeight }}>
					<RichText editor={editor} />
				</View>
			</View>
		</View>
	);
}
