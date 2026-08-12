import React from "react";
import { CodeBlock } from "./CodeBlock";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

function parseInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-foreground border border-border/60">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline font-medium hover:text-primary/80 transition-colors">$1</a>');
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  if (isHtml) {
    return (
      <div 
        className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed space-y-4 text-foreground"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }

  const normalizedContent = content
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const lines = normalizedContent.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "javascript";
  let tableBuffer: string[] = [];

  const flushTable = (idx: number) => {
    if (tableBuffer.length === 0) return;
    const rows = tableBuffer
      .map(row => row.trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim()))
      .filter(row => row.length > 0 && !row.every(cell => /^[-:]+$/.test(cell)));

    if (rows.length > 0) {
      const headerRow = rows[0];
      const bodyRows = rows.slice(1);
      elements.push(
        <div key={`table-${idx}`} className="overflow-x-auto my-6 rounded-xl border border-border bg-card shadow-xs">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/60 font-semibold text-foreground">
                {headerRow.map((cell, cIdx) => (
                  <th key={cIdx} className="p-3.5 border-r last:border-r-0 border-border" dangerouslySetInnerHTML={{ __html: parseInline(cell) }} />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-muted/40 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3.5 border-r last:border-r-0 border-border text-foreground/90" dangerouslySetInnerHTML={{ __html: parseInline(cell) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableBuffer = [];
  };

  lines.forEach((line, index) => {
    if (line.startsWith("```")) {
      flushTable(index);
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${index}`} className="my-4">
            <CodeBlock language={codeLang} code={codeBuffer.join("\n")} />
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.replace("```", "").trim() || "javascript";
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      tableBuffer.push(line);
      return;
    } else {
      flushTable(index);
    }

    if (line.trim() === "") {
      return;
    }

    if (line.startsWith("### ")) {
      elements.push(<h3 key={index} className="text-xl font-bold mt-6 mb-2 text-foreground tracking-tight" dangerouslySetInnerHTML={{ __html: parseInline(line.replace("### ", "")) }} />);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={index} className="text-2xl font-bold mt-8 mb-3 text-foreground tracking-tight border-b pb-2 border-border" dangerouslySetInnerHTML={{ __html: parseInline(line.replace("## ", "")) }} />);
    } else if (line.startsWith("# ")) {
      elements.push(<h1 key={index} className="text-3xl font-extrabold mt-10 mb-4 text-foreground tracking-tight" dangerouslySetInnerHTML={{ __html: parseInline(line.replace("# ", "")) }} />);
    } else if (line.startsWith("> [!NOTE]")) {
      const text = line.replace("> [!NOTE]", "").trim();
      elements.push(
        <div key={index} className="flex items-start space-x-3 my-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-foreground">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(text) }} />
        </div>
      );
    } else if (line.startsWith("> [!WARNING]")) {
      const text = line.replace("> [!WARNING]", "").trim();
      elements.push(
        <div key={index} className="flex items-start space-x-3 my-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-foreground">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(text) }} />
        </div>
      );
    } else if (line.startsWith("> [!TIP]")) {
      const text = line.replace("> [!TIP]", "").trim();
      elements.push(
        <div key={index} className="flex items-start space-x-3 my-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-foreground">
          <Lightbulb className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(text) }} />
        </div>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-primary pl-4 py-1.5 my-4 italic text-muted-foreground bg-muted/30 rounded-r-xl" dangerouslySetInnerHTML={{ __html: parseInline(line.replace("> ", "")) }} />
      );
    } else if (line === "---" || line === "***") {
      elements.push(<hr key={index} className="my-8 border-border" />);
    } else if (line.startsWith("- [ ] ") || line.startsWith("- [x] ") || line.startsWith("- [X] ")) {
      const checked = line.startsWith("- [x] ") || line.startsWith("- [X] ");
      const text = line.replace(/^- \[[ xX]\]\s+/, "");
      elements.push(
        <div key={index} className="flex items-center space-x-2.5 my-1.5">
          <input type="checkbox" checked={checked} readOnly className="h-4 w-4 rounded border-border accent-primary" />
          <span className={checked ? "line-through text-muted-foreground text-sm" : "text-sm text-foreground/90"} dangerouslySetInnerHTML={{ __html: parseInline(text) }} />
        </div>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(<li key={index} className="list-disc ml-6 my-1 text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(line.replace(/^[-*]\s+/, "")) }} />);
    } else {
      const imgRegex = /^!\[([^\]]*)\]\(([^)]+)\)$/;
      const imgMatch = line.match(imgRegex);
      if (imgMatch) {
        elements.push(
          <div key={index} className="my-5">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="rounded-xl max-h-[420px] w-full object-cover shadow-md border border-border" />
          </div>
        );
        return;
      }

      elements.push(
        <p 
          key={index} 
          className="my-3 leading-relaxed text-foreground/90" 
          dangerouslySetInnerHTML={{ __html: parseInline(line) }} 
        />
      );
    }
  });

  flushTable(lines.length);

  return <div className="prose prose-neutral dark:prose-invert max-w-none">{elements}</div>;
}
