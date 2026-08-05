import { Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import DOMPurify from "dompurify";

const lowlight = createLowlight(common);

export function getEditorExtensions(placeholderText = "Type '/' for commands or start writing your lesson...") {
  return [
    StarterKit.configure({
      codeBlock: false, // Using CodeBlockLowlight
    }),
    Placeholder.configure({
      placeholder: placeholderText,
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline cursor-pointer",
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: "rounded-lg max-h-[400px] w-full object-cover my-4 shadow-md",
      },
    }),
    Underline,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Highlight.configure({
      multicolor: true,
    }),
    CharacterCount,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
  ];
}

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "strong", "em", "u", "s", "code", "pre",
      "ul", "ol", "li", "blockquote", "hr", "img", "span", "div", "table", "thead", "tbody",
      "tr", "th", "td", "task-list", "task-item"
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class", "style", "data-checked"],
  });
}

export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = 200;
  return Math.ceil(words / wpm) || 1;
}
