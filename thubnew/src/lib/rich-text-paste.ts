import DOMPurify from "dompurify";
import TurndownService from "turndown";
// @ts-expect-error turndown-plugin-gfm does not publish TypeScript declarations.
import * as gfm from "turndown-plugin-gfm";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
  strongDelimiter: "**",
});

turndownService.use(gfm.gfm);
turndownService.keep(["mark", "sub", "sup"]);
turndownService.addRule("underline", {
  filter: ["u"],
  replacement: (content) => `<u>${content}</u>`,
});
turndownService.addRule("safeStyledSpan", {
  filter: (node) => node.nodeName === "SPAN" && Boolean((node as HTMLElement).getAttribute("style")),
  replacement: (content, node) => `<span style="${(node as HTMLElement).getAttribute("style")}">${content}</span>`,
});
turndownService.addRule("previewFencedCode", {
  filter: (node) => node instanceof HTMLElement && node.hasAttribute("data-code-language"),
  replacement: (_content, node) => {
    const element = node as HTMLElement;
    const language = element.dataset.codeLanguage || "text";
    const code = element.querySelector("pre code")?.textContent || "";
    return `\n\n\`\`\`${language}\n${code.replace(/\n$/, "")}\n\`\`\`\n\n`;
  },
});

const parseFontSize = (value: string): number => {
  const match = value.trim().match(/^([\d.]+)(px|pt|rem|em)?$/i);
  if (!match) return 0;
  const size = Number(match[1]);
  if (!Number.isFinite(size)) return 0;
  switch ((match[2] || "px").toLowerCase()) {
    case "pt": return size * (4 / 3);
    case "rem":
    case "em": return size * 16;
    default: return size;
  }
};

const safeCssColor = (value: string): string | null => {
  const color = value.trim();
  if (!color || /url|expression|var\s*\(/i.test(color)) return null;
  return /^(?:#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\)|[a-z]+)$/i.test(color)
    ? color
    : null;
};

const replaceWithWrappedContent = (element: HTMLElement, tags: string[], retainedStyle: string) => {
  const fragment = element.ownerDocument.createDocumentFragment();
  while (element.firstChild) fragment.appendChild(element.firstChild);

  let content: Node = fragment;
  if (retainedStyle) {
    const span = element.ownerDocument.createElement("span");
    span.setAttribute("style", retainedStyle);
    span.appendChild(content);
    content = span;
  }
  tags.forEach((tag) => {
    const wrapper = element.ownerDocument.createElement(tag);
    wrapper.appendChild(content);
    content = wrapper;
  });
  element.replaceWith(content);
};

/** Convert Google Docs/Word inline CSS into semantic HTML Turndown can preserve. */
const normalizeOfficeHtml = (html: string): string => {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");

  document.querySelectorAll("script,style,meta,link,xml,title").forEach((node) => node.remove());

  document.querySelectorAll<HTMLElement>("p,div").forEach((block) => {
    if (block.closest("li,td,th,blockquote")) return;
    const sizes = [block, ...Array.from(block.querySelectorAll<HTMLElement>("span,font"))]
      .map((element) => parseFontSize(element.style.fontSize || element.getAttribute("size") || ""));
    const largestSize = Math.max(0, ...sizes);
    const text = block.textContent?.trim() || "";
    const isHeadingCandidate = text.length > 0 && text.length <= 180;
    const level = largestSize >= 25 ? 1 : largestSize >= 20.5 ? 2 : largestSize >= 17.5 ? 3 : 0;
    if (!level || !isHeadingCandidate || /^H[1-6]$/.test(block.tagName)) return;

    const heading = document.createElement(`h${level}`);
    while (block.firstChild) heading.appendChild(block.firstChild);
    block.replaceWith(heading);
  });

  document.querySelectorAll<HTMLElement>("span,font").forEach((element) => {
    const style = element.style;
    const weight = style.fontWeight.toLowerCase();
    const numericWeight = Number.parseInt(weight, 10);
    const decoration = `${style.textDecoration} ${style.textDecorationLine}`.toLowerCase();
    const family = style.fontFamily.toLowerCase();
    const tags: string[] = [];

    if (weight === "bold" || weight === "bolder" || numericWeight >= 600) tags.push("strong");
    if (style.fontStyle.toLowerCase() === "italic") tags.push("em");
    if (decoration.includes("underline")) tags.push("u");
    if (decoration.includes("line-through")) tags.push("s");
    if (style.verticalAlign === "super") tags.push("sup");
    if (style.verticalAlign === "sub") tags.push("sub");
    if (/monospace|courier|consolas|menlo|monaco/.test(family)) tags.push("code");

    const retainedStyles: string[] = [];
    const color = safeCssColor(style.color || element.getAttribute("color") || "");
    const background = safeCssColor(style.backgroundColor || "");
    if (color && color !== "#000000" && color !== "rgb(0, 0, 0)") retainedStyles.push(`color:${color}`);
    if (background && background !== "transparent" && background !== "rgba(0, 0, 0, 0)") {
      retainedStyles.push(`background-color:${background}`);
    }

    replaceWithWrappedContent(element, tags, retainedStyles.join(";"));
  });

  document.querySelectorAll<HTMLElement>("b").forEach((element) => {
    if (element.id?.startsWith("docs-internal-guid")) element.removeAttribute("id");
  });
  return document.body.innerHTML;
};

export function richTextHtmlToMarkdown(html: string): string {
  const sanitized = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["mark", "sub", "sup"],
    ADD_ATTR: ["style", "color", "size", "start"],
  });
  const normalized = normalizeOfficeHtml(sanitized);
  return turndownService.turndown(normalized)
    .replace(/\u00A0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
