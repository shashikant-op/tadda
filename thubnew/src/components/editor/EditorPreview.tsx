"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { sanitizeHtml } from "./lib/editor";
import { Eye, ShieldCheck } from "lucide-react";

interface EditorPreviewProps {
  contentHtml: string;
  onChange?: (html: string) => void;
}

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export function EditorPreview({ contentHtml, onChange }: EditorPreviewProps) {
  const sanitized = sanitizeHtml(contentHtml);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [overlayStyle, setOverlayStyle] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const resizingRef = useRef<{ handle: ResizeHandle; startX: number; startY: number; startW: number; startH: number } | null>(null);

  const updateOverlayPosition = useCallback(() => {
    if (!selectedImg || !wrapperRef.current) return;
    const container = wrapperRef.current;
    const containerRect = container.getBoundingClientRect();
    const imgRect = selectedImg.getBoundingClientRect();
    setOverlayStyle({
      left: imgRect.left - containerRect.left + container.scrollLeft,
      top: imgRect.top - containerRect.top + container.scrollTop,
      width: imgRect.width,
      height: imgRect.height,
    });
  }, [selectedImg]);

  useEffect(() => {
    if (!selectedImg) {
      setOverlayStyle(null);
      return;
    }
    updateOverlayPosition();
    const onScrollOrResize = () => updateOverlayPosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [selectedImg, updateOverlayPosition, sanitized]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedImg(target as HTMLImageElement);
        setTimeout(() => updateOverlayPosition(), 0);
      } else {
        const overlay = document.querySelector("[data-canva-overlay-preview]");
        if (overlay && overlay.contains(target)) return;
        setSelectedImg(null);
      }
    };
    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [updateOverlayPosition]);

  const syncToParent = useCallback(() => {
    if (!contentRef.current || !onChange) return;
    // contentRef innerHTML is the live edited HTML with resized img styles
    const html = contentRef.current.innerHTML;
    onChange(html);
  }, [onChange]);

  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    if (!selectedImg) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = selectedImg.getBoundingClientRect();
    resizingRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height,
    };

    const onMove = (ev: MouseEvent) => {
      if (!resizingRef.current || !selectedImg) return;
      const { handle: h, startX, startY, startW, startH } = resizingRef.current;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let newW = startW;
      let newH = startH;
      if (h.includes("e")) newW = startW + dx;
      if (h.includes("w")) newW = startW - dx;
      if (h.includes("s")) newH = startH + dy;
      if (h.includes("n")) newH = startH - dy;
      newW = Math.max(40, Math.round(newW));
      newH = Math.max(40, Math.round(newH));
      selectedImg.style.width = `${newW}px`;
      selectedImg.style.height = `${newH}px`;
      selectedImg.style.maxWidth = "none";
      selectedImg.setAttribute("width", String(newW));
      selectedImg.setAttribute("height", String(newH));
      selectedImg.style.objectFit = "contain";
      if (wrapperRef.current) {
        const containerRect = wrapperRef.current.getBoundingClientRect();
        const imgRect = selectedImg.getBoundingClientRect();
        setOverlayStyle({
          left: imgRect.left - containerRect.left + wrapperRef.current.scrollLeft,
          top: imgRect.top - containerRect.top + wrapperRef.current.scrollTop,
          width: imgRect.width,
          height: imgRect.height,
        });
      }
    };

    const onUp = () => {
      resizingRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      syncToParent();
      setTimeout(() => updateOverlayPosition(), 0);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="border rounded-xl bg-card p-8 min-h-[400px] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b pb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <span className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-primary" />
          <span>Live Production Preview — Click image to resize</span>
        </span>
        <span className="flex items-center space-x-1 text-emerald-600">
          <ShieldCheck className="h-4 w-4" />
          <span>DOMPurify Sanitized</span>
        </span>
      </div>

      <div ref={wrapperRef} className="relative">
        <div
          ref={contentRef}
          className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed [&_img]:cursor-pointer [&_img]:max-w-full [&_img]:select-none [&_img]:rounded-xl"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />

        {selectedImg && overlayStyle && (
          <div
            data-canva-overlay-preview
            className="absolute pointer-events-none border-2 border-primary rounded-sm"
            style={{
              left: overlayStyle.left,
              top: overlayStyle.top,
              width: overlayStyle.width,
              height: overlayStyle.height,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.8)",
            }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
              {Math.round(overlayStyle.width)} × {Math.round(overlayStyle.height)}
            </div>
            {(["nw", "ne", "sw", "se"] as ResizeHandle[]).map((h) => (
              <div
                key={h}
                onMouseDown={(e) => handleResizeStart(e, h)}
                className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm shadow-md pointer-events-auto"
                style={{
                  cursor: h === "nw" || h === "se" ? "nwse-resize" : "nesw-resize",
                  top: h.includes("n") ? -6 : "auto",
                  bottom: h.includes("s") ? -6 : "auto",
                  left: h.includes("w") ? -6 : "auto",
                  right: h.includes("e") ? -6 : "auto",
                }}
              />
            ))}
            {(["n", "s", "e", "w"] as ResizeHandle[]).map((h) => (
              <div
                key={h}
                onMouseDown={(e) => handleResizeStart(e, h)}
                className="absolute bg-white border border-primary shadow-md pointer-events-auto"
                style={{
                  cursor: h === "n" || h === "s" ? "ns-resize" : "ew-resize",
                  width: h === "n" || h === "s" ? 20 : 8,
                  height: h === "n" || h === "s" ? 8 : 20,
                  borderRadius: 999,
                  top: h === "n" ? -4 : h === "s" ? "auto" : "50%",
                  bottom: h === "s" ? -4 : "auto",
                  left: h === "w" ? -4 : h === "e" ? "auto" : "50%",
                  right: h === "e" ? -4 : "auto",
                  transform: h === "n" || h === "s" ? "translateX(-50%)" : h === "w" || h === "e" ? "translateY(-50%)" : undefined,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">Tip: Click any image, drag the white handles (Canva-style) to resize. Size is saved — students see the exact dimensions.</p>
    </div>
  );
}
