import React from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  FileCode,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  RemoveFormatting,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  onOpenLinkDialog: () => void;
  onOpenImageUpload: () => void;
}

export function EditorToolbar({ editor, onOpenLinkDialog, onOpenImageUpload }: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/40 border-b text-xs sticky top-16 z-20 backdrop-blur-md">
      {/* Headings / Paragraph */}
      <div className="flex items-center space-x-0.5 bg-background border rounded-md p-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          aria-label="Paragraph"
          aria-pressed={editor.isActive("paragraph")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("paragraph") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Paragraph"
        >
          <Pilcrow className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Heading 1"
          aria-pressed={editor.isActive("heading", { level: 1 })}
          role="button"
          className={`p-1.5 rounded transition-colors font-bold ${editor.isActive("heading", { level: 1 }) ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
          aria-pressed={editor.isActive("heading", { level: 2 })}
          role="button"
          className={`p-1.5 rounded transition-colors font-bold ${editor.isActive("heading", { level: 2 }) ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Heading 3"
          aria-pressed={editor.isActive("heading", { level: 3 })}
          role="button"
          className={`p-1.5 rounded transition-colors font-bold ${editor.isActive("heading", { level: 3 }) ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-4 w-[1px] bg-border mx-1" />

      {/* Inline Formatting */}
      <div className="flex items-center space-x-0.5 bg-background border rounded-md p-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          aria-pressed={editor.isActive("bold")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("bold") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          aria-pressed={editor.isActive("italic")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("italic") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
          aria-pressed={editor.isActive("underline")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("underline") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
          aria-pressed={editor.isActive("strike")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("strike") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Strikethrough"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          aria-label="Inline Code"
          aria-pressed={editor.isActive("code")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("code") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Inline Code"
        >
          <Code className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          aria-label="Highlight"
          aria-pressed={editor.isActive("highlight")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("highlight") ? "bg-amber-400 text-black shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Highlight"
        >
          <Highlighter className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-4 w-[1px] bg-border mx-1" />

      {/* Lists & Blocks */}
      <div className="flex items-center space-x-0.5 bg-background border rounded-md p-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
          aria-pressed={editor.isActive("bulletList")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("bulletList") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Bullet List (Ctrl+Shift+8)"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
          aria-pressed={editor.isActive("orderedList")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("orderedList") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Ordered List (Ctrl+Shift+7)"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          aria-label="Task List"
          aria-pressed={editor.isActive("taskList")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("taskList") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Task List"
        >
          <CheckSquare className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
          aria-pressed={editor.isActive("blockquote")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("blockquote") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Quote"
        >
          <Quote className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          aria-label="Code Block"
          aria-pressed={editor.isActive("codeBlock")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("codeBlock") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Code Block"
        >
          <FileCode className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          aria-label="Divider"
          role="button"
          className="p-1.5 rounded hover:bg-muted text-foreground"
          title="Divider / Horizontal Rule"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-4 w-[1px] bg-border mx-1" />

      {/* Alignment */}
      <div className="flex items-center space-x-0.5 bg-background border rounded-md p-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          aria-label="Align Left"
          aria-pressed={editor.isActive({ textAlign: "left" })}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Align Left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          aria-label="Align Center"
          aria-pressed={editor.isActive({ textAlign: "center" })}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Align Center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          aria-label="Align Right"
          aria-pressed={editor.isActive({ textAlign: "right" })}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Align Right"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-4 w-[1px] bg-border mx-1" />

      {/* Insert Link & Image */}
      <div className="flex items-center space-x-0.5 bg-background border rounded-md p-0.5">
        <button
          type="button"
          onClick={onOpenLinkDialog}
          aria-label="Link"
          aria-pressed={editor.isActive("link")}
          role="button"
          className={`p-1.5 rounded transition-colors ${editor.isActive("link") ? "bg-primary text-primary-foreground shadow-xs" : "hover:bg-muted text-foreground"}`}
          title="Link (Ctrl+K)"
        >
          <LinkIcon className="h-3.5 w-3.5 text-primary" />
        </button>
        <button
          type="button"
          onClick={onOpenImageUpload}
          aria-label="Image"
          role="button"
          className="p-1.5 rounded hover:bg-muted text-foreground"
          title="Insert Image"
        >
          <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
        </button>
      </div>

      <div className="h-4 w-[1px] bg-border mx-1" />

      {/* History & Clear */}
      <div className="flex items-center space-x-0.5 bg-background border rounded-md p-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
          role="button"
          className="p-1.5 rounded hover:bg-muted text-foreground disabled:opacity-40"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
          role="button"
          className="p-1.5 rounded hover:bg-muted text-foreground disabled:opacity-40"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          aria-label="Clear Formatting"
          role="button"
          className="p-1.5 rounded hover:bg-muted text-foreground"
          title="Clear Formatting"
        >
          <RemoveFormatting className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
