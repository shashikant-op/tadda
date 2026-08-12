import React, { useState, useEffect, useCallback } from "react";
import { type Editor } from "@tiptap/react";
import { Heading1, Heading2, Image as ImageIcon, Minus, FileCode, Quote, CheckSquare, Sparkles } from "lucide-react";

interface EditorSlashMenuProps {
  editor: Editor | null;
  onOpenImageUpload: () => void;
}

export function EditorSlashMenu({ editor, onOpenImageUpload }: EditorSlashMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    { label: "Heading 1", icon: Heading1, action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "Heading 2", icon: Heading2, action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Image Upload", icon: ImageIcon, action: () => onOpenImageUpload() },
    { label: "Code Block", icon: FileCode, action: () => editor?.chain().focus().toggleCodeBlock().run() },
    { label: "Quote", icon: Quote, action: () => editor?.chain().focus().toggleBlockquote().run() },
    { label: "Checklist", icon: CheckSquare, action: () => editor?.chain().focus().toggleTaskList().run() },
    { label: "Divider", icon: Minus, action: () => editor?.chain().focus().setHorizontalRule().run() },
  ];

  const filteredCommands = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  const executeCommand = useCallback((index: number) => {
    const cmd = filteredCommands[index];
    if (cmd) {
      // Remove the "/" and query text before executing command
      const { from } = editor!.state.selection;
      const textBefore = editor!.state.doc.textBetween(Math.max(0, from - 20), from, "\n");
      const slashIndex = textBefore.lastIndexOf("/");
      if (slashIndex !== -1) {
        const deleteCount = textBefore.length - slashIndex;
        editor!.chain().focus().deleteRange({ from: from - deleteCount, to: from }).run();
      }
      cmd.action();
      setIsOpen(false);
    }
  }, [editor, filteredCommands]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(Math.max(0, from - 15), from, "\n");
      if (textBefore.endsWith("/")) {
        setIsOpen(true);
        setQuery("");
        setSelectedIndex(0);
      } else if (isOpen && textBefore.includes("/")) {
        const queryText = textBefore.split("/").pop() || "";
        setQuery(queryText);
      } else {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (_view: unknown, event: KeyboardEvent) => {
      if (!isOpen) return false;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        return true;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return true;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        executeCommand(selectedIndex);
        return true;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return true;
      }
      return false;
    };

    editor.on("update", handleUpdate);
    editor.setOptions({
      editorProps: {
        handleKeyDown: (view, event) => handleKeyDown(view, event),
      },
    });

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, isOpen, selectedIndex, filteredCommands, executeCommand]);

  if (!isOpen || filteredCommands.length === 0) return null;

  return (
    <div className="absolute z-50 bg-background border rounded-xl shadow-2xl w-64 p-2 space-y-1 mt-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 flex items-center space-x-1">
        <Sparkles className="h-3 w-3 text-primary" />
        <span>Slash Commands (Navigate with Arrow Keys & Enter)</span>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-0.5">
        {filteredCommands.map((cmd, idx) => {
          const Icon = cmd.icon;
          return (
            <button
              key={cmd.label}
              type="button"
              onClick={() => executeCommand(idx)}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                idx === selectedIndex ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{cmd.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
