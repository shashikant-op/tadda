import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ExternalLink } from "lucide-react";

interface EditorLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string, text: string, openInNewTab: boolean, nofollow: boolean) => void;
  initialUrl?: string;
  initialText?: string;
}

export function EditorLinkDialog({ isOpen, onClose, onSave, initialUrl = "", initialText = "" }: EditorLinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [nofollow, setNofollow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    setError(null);
    onSave(url, text || url, openInNewTab, nofollow);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/50 backdrop-blur-xs">
      <div className="bg-card border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-base flex items-center space-x-2">
            <ExternalLink className="h-4 w-4 text-primary" />
            <span>Insert / Edit Link</span>
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL *</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Link Display Title (Optional)</label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Click here or website name"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                className="rounded border-input"
              />
              <span className="text-xs font-medium">Open in new tab</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={nofollow}
                onChange={(e) => setNofollow(e.target.checked)}
                className="rounded border-input"
              />
              <span className="text-xs font-medium">Add rel=&quot;nofollow&quot;</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Apply Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
