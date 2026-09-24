import React, { useState, useRef, useEffect } from "react";
import { sanitizeHtml } from "./lib/editor";
import { Eye, ShieldCheck, X, Sliders } from "lucide-react";

interface EditorPreviewProps {
  contentHtml: string;
}

export function EditorPreview({ contentHtml }: EditorPreviewProps) {
  const sanitized = sanitizeHtml(contentHtml);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [imgWidth, setImgWidth] = useState<string>("100%");
  const [imgHeight, setImgHeight] = useState<string>("auto");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "IMG") {
        e.preventDefault();
        const img = target as HTMLImageElement;
        setSelectedImg(img);
        setImgWidth(img.style.width || img.getAttribute("width") || `${img.naturalWidth || img.clientWidth || 400}px`);
        setImgHeight(img.style.height || img.getAttribute("height") || "auto");
      } else if (!target.closest(".image-resize-toolbar")) {
        setSelectedImg(null);
      }
    };

    container.addEventListener("click", handleImageClick);
    return () => container.removeEventListener("click", handleImageClick);
  }, []);

  const updateImageSize = (w: string, h: string) => {
    setImgWidth(w);
    setImgHeight(h);
    if (selectedImg) {
      selectedImg.style.width = w;
      selectedImg.style.height = h;
      if (w) selectedImg.setAttribute("width", w);
      if (h && h !== "auto") selectedImg.setAttribute("height", h);
      else selectedImg.removeAttribute("height");
    }
  };

  return (
    <div className="border rounded-xl bg-card p-8 min-h-[400px] shadow-xs space-y-4 relative">
      <div className="flex items-center justify-between border-b pb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <span className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-primary" />
          <span>Live Production Preview (Click any image to resize width & height)</span>
        </span>
        <span className="flex items-center space-x-1 text-emerald-600">
          <ShieldCheck className="h-4 w-4" />
          <span>DOMPurify Sanitized</span>
        </span>
      </div>

      {selectedImg && (
        <div className="image-resize-toolbar sticky top-4 z-20 flex flex-wrap items-center gap-3 bg-card border border-emerald-500 shadow-xl rounded-xl p-3 text-xs">
          <div className="flex items-center space-x-1.5 font-semibold text-emerald-700">
            <Sliders className="h-4 w-4" />
            <span>Resize Image</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-muted-foreground font-medium">Width:</span>
            <input
              type="text"
              value={imgWidth}
              onChange={(e) => updateImageSize(e.target.value, imgHeight)}
              className="w-20 px-2 py-1 border rounded text-xs bg-background"
              placeholder="e.g. 100%, 400px"
            />
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-muted-foreground font-medium">Height:</span>
            <input
              type="text"
              value={imgHeight}
              onChange={(e) => updateImageSize(imgWidth, e.target.value)}
              className="w-20 px-2 py-1 border rounded text-xs bg-background"
              placeholder="e.g. auto, 300px"
            />
          </div>

          <div className="flex items-center space-x-1 border-l pl-3">
            <button
              type="button"
              onClick={() => updateImageSize("25%", "auto")}
              className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[11px] font-medium"
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => updateImageSize("50%", "auto")}
              className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[11px] font-medium"
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => updateImageSize("75%", "auto")}
              className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[11px] font-medium"
            >
              75%
            </button>
            <button
              type="button"
              onClick={() => updateImageSize("100%", "auto")}
              className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[11px] font-medium"
            >
              100%
            </button>
            <button
              type="button"
              onClick={() => updateImageSize("auto", "auto")}
              className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[11px] font-medium"
            >
              Original
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSelectedImg(null)}
            className="ml-auto p-1 text-muted-foreground hover:text-foreground rounded"
            title="Close resizer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed [&_img]:cursor-pointer [&_img]:transition-all [&_img]:rounded-lg [&_img]:border-2 [&_img]:border-transparent hover:[&_img]:border-emerald-500/50"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
}
