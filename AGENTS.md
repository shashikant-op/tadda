# Production Task: Replace the Current Text Editor with a Production-Ready Rich Text Editor

You are a Senior Staff Frontend Engineer with 20+ years of experience building production CMS platforms.

Your task is to completely audit and rebuild the text editor section. Do NOT make superficial fixes. The final implementation must be production-ready, secure, maintainable, accessible, and scalable.

## Goal

Transform the current editor into a professional editor comparable to Notion, Medium, GitBook, or Hashnode.

The current implementation uses `contentEditable` and `document.execCommand`, which are deprecated and unsuitable for production.

Do not preserve the existing implementation unless absolutely necessary.

---

# Requirements

## 1. Remove Deprecated APIs

Completely remove every usage of:

* document.execCommand()
* prompt()
* direct HTML insertion
* browser-dependent formatting

Do not leave dead code.

---

## 2. Use TipTap

Replace the editor with TipTap.

Install and configure:

* @tiptap/react
* @tiptap/starter-kit
* @tiptap/extension-placeholder
* @tiptap/extension-link
* @tiptap/extension-image
* @tiptap/extension-underline
* @tiptap/extension-text-align
* @tiptap/extension-highlight
* @tiptap/extension-character-count
* @tiptap/extension-task-list
* @tiptap/extension-task-item
* @tiptap/extension-code-block-lowlight

Organize extensions cleanly.

---

## 3. Modular Architecture

Refactor the editor into reusable components.

Example:

components/editor/

Editor.tsx

EditorToolbar.tsx

BubbleMenu.tsx

FloatingMenu.tsx

EditorImageUpload.tsx

EditorLinkDialog.tsx

EditorCharacterCounter.tsx

EditorPreview.tsx

EditorSlashMenu.tsx

hooks/

useEditorAutosave.ts

useEditorHistory.ts

lib/

editor.ts

Do not keep everything inside one page.

---

## 4. Toolbar

Implement a professional toolbar.

Support:

* Bold
* Italic
* Underline
* Strike
* Code
* Inline code
* H1
* H2
* H3
* Paragraph
* Bullet list
* Ordered list
* Task list
* Quote
* Divider
* Code block
* Image
* Link
* Undo
* Redo
* Text alignment
* Highlight
* Clear formatting

Toolbar buttons must show active state.

---

## 5. Floating Bubble Menu

When text is selected show:

Bold

Italic

Link

Highlight

Code

Heading

Exactly like Notion.

---

## 6. Floating Slash Command

Typing "/"

opens a searchable command menu.

Commands:

Heading

Image

Video

Divider

Code Block

Quote

Checklist

Table

Callout

Horizontal Rule

The menu must support keyboard navigation.

---

## 7. Image Upload

Do NOT use prompt().

Implement image upload.

Requirements:

Drag & Drop

Paste Image

Click Upload

Upload Progress

Image Preview

Image Resize

Image Delete

Only insert uploaded URLs.

Never insert raw HTML.

---

## 8. Link Dialog

Replace prompt() with a proper modal.

Fields:

URL

Title

Open in new tab

rel="nofollow"

Validate URL.

---

## 9. Autosave

Implement debounce autosave.

Flow:

User types

↓

Wait 2 seconds

↓

PATCH draft

↓

Show

Saving...

Saved

Failed

Never spam API calls.

---

## 10. Unsaved Changes

Warn user before leaving page.

Support:

Browser refresh

Closing tab

Changing route

---

## 11. Word Count

Display:

Words

Characters

Paragraphs

Estimated reading time

Live updates.

---

## 12. Paste Handling

Intercept paste.

Remove:

inline styles

office html

empty spans

font tags

junk markup

Keep:

bold

italic

lists

tables

links

images

Produce clean HTML/JSON.

---

## 13. Keyboard Shortcuts

Implement:

Ctrl+B

Ctrl+I

Ctrl+U

Ctrl+Shift+7

Ctrl+Shift+8

Ctrl+K

Ctrl+Z

Ctrl+Y

Tab

Shift+Tab

Escape

---

## 14. Accessibility

Toolbar buttons must include:

aria-label

aria-pressed

role

keyboard navigation

focus indicators

Screen reader compatible.

---

## 15. Mobile Support

Toolbar must be responsive.

Support:

Horizontal scrolling

Sticky toolbar

Touch friendly controls

No overflow.

---

## 16. Performance

Prevent unnecessary rerenders.

Use:

React.memo

useCallback

useMemo

Lazy loading

Debounced updates

Avoid expensive renders.

---

## 17. Security

Sanitize all HTML.

Use DOMPurify.

Prevent:

XSS

Script injection

Malformed HTML

Unsafe attributes

Never trust user HTML.

---

## 18. Storage

Do NOT store arbitrary HTML.

Store TipTap JSON document.

Convert to HTML only when rendering.

Maintain backward compatibility with existing HTML if possible.

---

## 19. Preview

Preview must render exactly what the editor produces.

No rendering mismatches.

Support:

Code blocks

Images

Lists

Tables

Links

Task lists

Headings

---

## 20. Error Handling

Handle:

Image upload failures

Autosave failures

Network loss

Invalid links

Invalid content

Show user-friendly error messages.

---

## 21. Production Code Quality

Strict TypeScript.

No any.

No duplicated logic.

No console.log left behind.

No unused imports.

No dead state.

No deprecated APIs.

No memory leaks.

No race conditions.

No hydration issues.

---

## 22. Code Review

After implementation:

* Remove all obsolete editor code.
* Remove document.execCommand().
* Remove contentEditable implementation.
* Remove prompt().
* Remove dangerous HTML insertion.
* Fix lint warnings.
* Fix TypeScript errors.
* Ensure the project builds successfully.
* Ensure the editor works in Chrome, Firefox, Safari, and Edge.

---

## Deliverables

1. Complete production-ready TipTap editor.
2. Modular component architecture.
3. Clean TypeScript implementation.
4. Fully responsive UI.
5. Accessible toolbar.
6. Autosave.
7. Image upload.
8. Link modal.
9. Slash commands.
10. Bubble menu.
11. Keyboard shortcuts.
12. Secure HTML sanitization.
13. Word count.
14. Reading time.
15. Unsaved changes protection.
16. No deprecated browser APIs.
17. No regressions in existing tutorial create/edit functionality.

Do not stop after partial implementation. Continue until every requirement above is completed, all lint errors are fixed, and the project compiles successfully.
