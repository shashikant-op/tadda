import React from "react";
import { CodeBlock } from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  if (isHtml) {
    return (
      <div 
        className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "javascript";

  lines.forEach((line, index) => {
    if (line.startsWith("```")) {
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

    if (line.startsWith("### ")) {
      elements.push(<h3 key={index} className="text-xl font-bold mt-6 mb-2">{line.replace("### ", "")}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={index} className="text-2xl font-bold mt-8 mb-3">{line.replace("## ", "")}</h2>);
    } else if (line.startsWith("# ")) {
      elements.push(<h1 key={index} className="text-3xl font-extrabold mt-10 mb-4">{line.replace("# ", "")}</h1>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(<li key={index} className="list-disc ml-6 my-1">{line.replace(/^[-*]\s+/, "")}</li>);
    } else if (line.trim() === "") {
      elements.push(<div key={index} className="h-4" />);
    } else {
      const imgRegex = /^!\[([^\]]*)\]\(([^)]+)\)$/;
      const imgMatch = line.match(imgRegex);
      if (imgMatch) {
        elements.push(
          <div key={index} className="my-4">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="rounded-lg max-h-96 w-full object-cover shadow-md border" />
          </div>
        );
        return;
      }

      let html = line
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline font-medium hover:text-primary/80">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

      elements.push(
        <p 
          key={index} 
          className="my-2 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      );
    }
  });

  return <div className="prose prose-neutral dark:prose-invert max-w-none">{elements}</div>;
}
