'use client';

import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import {
	Bold,
	Check,
	Italic,
	Link as LinkIcon,
	List,
	ListOrdered,
	Underline as UnderlineIcon,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
	editorClassName?: string;
	id?: string;
	onChange: (html: string) => void;
	placeholder?: string;
	value: string;
}

const EMPTY_HTML = '<p></p>';

function ToolbarButton({
	active,
	label,
	onClick,
	children,
}: {
	active: boolean;
	label: string;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<Button
			aria-label={label}
			aria-pressed={active}
			className={cn(
				'text-muted-foreground',
				active && 'bg-accent text-foreground'
			)}
			onClick={onClick}
			size="icon-sm"
			title={label}
			type="button"
			variant="ghost"
		>
			{children}
		</Button>
	);
}

export default function RichTextEditor({
	value,
	onChange,
	placeholder,
	id,
	editorClassName,
}: RichTextEditorProps) {
	const [linkEditing, setLinkEditing] = useState(false);
	const [linkUrl, setLinkUrl] = useState('');

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				link: { openOnClick: false, autolink: true },
			}),
			Placeholder.configure({ placeholder: placeholder ?? 'Write here…' }),
		],
		content: value || '',
		editorProps: {
			attributes: {
				...(id ? { id } : {}),
				class: cn(
					'min-h-32 w-full px-3 py-2 text-sm outline-none',
					'[&_a]:text-primary [&_a]:underline [&_p]:my-0',
					'[&_ol]:my-1 [&_ol]:list-decimal [&_ol]:ps-5 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:ps-5',
					'[&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-muted-foreground/72 [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
					editorClassName
				),
			},
		},
		onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
	});

	const state = useEditorState({
		editor,
		selector: ({ editor: instance }) => ({
			isBold: instance?.isActive('bold') ?? false,
			isItalic: instance?.isActive('italic') ?? false,
			isUnderline: instance?.isActive('underline') ?? false,
			isBulletList: instance?.isActive('bulletList') ?? false,
			isOrderedList: instance?.isActive('orderedList') ?? false,
			isLink: instance?.isActive('link') ?? false,
		}),
	});

	// Keep the editor in sync when the value is replaced externally (e.g. when a
	// template is selected). Guard against feedback loops by comparing HTML.
	useEffect(() => {
		if (!editor) {
			return;
		}
		const next = value || EMPTY_HTML;
		if (next !== editor.getHTML()) {
			editor.commands.setContent(next, { emitUpdate: false });
		}
	}, [value, editor]);

	if (!editor) {
		return null;
	}

	const onLinkButton = () => {
		if (editor.isActive('link')) {
			editor.chain().focus().unsetLink().run();
			return;
		}
		const existing = editor.getAttributes('link').href as string | undefined;
		setLinkUrl(existing ?? '');
		setLinkEditing(true);
	};

	const applyLink = () => {
		const url = linkUrl.trim();
		if (url) {
			editor
				.chain()
				.focus()
				.extendMarkRange('link')
				.setLink({ href: url })
				.run();
		}
		setLinkEditing(false);
		setLinkUrl('');
	};

	return (
		<div className="w-full rounded-lg border border-input bg-background transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/24">
			<div className="flex flex-wrap items-center gap-0.5 border-b px-1.5 py-1">
				<ToolbarButton
					active={state?.isBold ?? false}
					label="Bold"
					onClick={() => editor.chain().focus().toggleBold().run()}
				>
					<Bold />
				</ToolbarButton>
				<ToolbarButton
					active={state?.isItalic ?? false}
					label="Italic"
					onClick={() => editor.chain().focus().toggleItalic().run()}
				>
					<Italic />
				</ToolbarButton>
				<ToolbarButton
					active={state?.isUnderline ?? false}
					label="Underline"
					onClick={() => editor.chain().focus().toggleUnderline().run()}
				>
					<UnderlineIcon />
				</ToolbarButton>
				<ToolbarButton
					active={state?.isBulletList ?? false}
					label="Bullet list"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
				>
					<List />
				</ToolbarButton>
				<ToolbarButton
					active={state?.isOrderedList ?? false}
					label="Numbered list"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
				>
					<ListOrdered />
				</ToolbarButton>
				<ToolbarButton
					active={state?.isLink ?? false}
					label="Link"
					onClick={onLinkButton}
				>
					<LinkIcon />
				</ToolbarButton>
			</div>
			{linkEditing ? (
				<div className="flex items-center gap-2 border-b px-2 py-1.5">
					<Input
						aria-label="Link URL"
						className="h-7"
						onChange={(event) => setLinkUrl(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								applyLink();
							}
						}}
						placeholder="https://example.com"
						value={linkUrl}
					/>
					<Button onClick={applyLink} size="sm" type="button" variant="outline">
						<Check aria-hidden /> Apply
					</Button>
					<Button
						onClick={() => {
							setLinkEditing(false);
							setLinkUrl('');
						}}
						size="sm"
						type="button"
						variant="outline"
					>
						<X aria-hidden /> Cancel
					</Button>
				</div>
			) : null}
			<EditorContent editor={editor} />
		</div>
	);
}
