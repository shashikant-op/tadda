export interface AiImagePromptSuggestion {
  id: string;
  placement: { type: string; reference: string };
  visualType: string;
  title: string;
  educationalPurpose: string;
  conceptsCovered: string[];
  requiredElements: string[];
  imagePrompt: string;
  avoid: string[];
}

export const AI_IMAGE_PROMPT_LANGUAGE = "ai-image-prompt";

const AI_BLOCK_PATTERN = /\n*```ai-image-prompt\s*\n[\s\S]*?\n```\n*/gi;

export function removeAiImagePromptBlocks(content: string): string {
  return content.replace(AI_BLOCK_PATTERN, "\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

function asBlock(suggestion: AiImagePromptSuggestion): string {
  return `\`\`\`${AI_IMAGE_PROMPT_LANGUAGE}\n${suggestion.imagePrompt.trim()}\n\`\`\``;
}

function normalized(value: string): string {
  return value
    .replace(/[#>*_`~\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function findPlacementIndex(blocks: string[], suggestion: AiImagePromptSuggestion): number {
  const reference = normalized(suggestion.placement.reference);
  if (reference) {
    const exactIndex = blocks.findIndex((block) => {
      const candidate = normalized(block);
      return candidate.includes(reference) || reference.includes(candidate);
    });
    if (exactIndex >= 0) return exactIndex;
  }

  const paragraphMatch = suggestion.placement.type.match(/paragraph[_\s-]*(\d+)/i);
  if (paragraphMatch) {
    const paragraphs = blocks
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => !/^\s*#{1,6}\s/.test(block));
    const requested = Math.max(0, Number(paragraphMatch[1]) - 1);
    if (paragraphs[requested]) return paragraphs[requested].index;
  }

  return blocks.length - 1;
}

export function insertAiImagePrompts(
  originalContent: string,
  suggestions: AiImagePromptSuggestion[],
): string {
  const cleanContent = removeAiImagePromptBlocks(originalContent);
  if (suggestions.length === 0) return cleanContent;

  const blocks = cleanContent.split(/\n\s*\n/).filter(Boolean);
  const insertions = new Map<number, { before: string[]; after: string[] }>();

  suggestions.forEach((suggestion) => {
    const index = findPlacementIndex(blocks, suggestion);
    const current = insertions.get(index) || { before: [], after: [] };
    const location = suggestion.placement.type.toLowerCase().startsWith("before_")
      ? current.before
      : current.after;
    location.push(asBlock(suggestion));
    insertions.set(index, current);
  });

  const result: string[] = [];
  blocks.forEach((block, index) => {
    const insertion = insertions.get(index);
    if (insertion) result.push(...insertion.before);
    result.push(block);
    if (insertion) result.push(...insertion.after);
  });

  return result.join("\n\n").trim();
}

export function parseAiImagePrompt(value: string): AiImagePromptSuggestion | null {
  try {
    const parsed = JSON.parse(value) as Partial<AiImagePromptSuggestion>;
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.title !== "string" ||
      typeof parsed.visualType !== "string" ||
      typeof parsed.educationalPurpose !== "string" ||
      typeof parsed.imagePrompt !== "string" ||
      !parsed.placement ||
      typeof parsed.placement.type !== "string" ||
      typeof parsed.placement.reference !== "string"
    ) {
      return null;
    }
    return {
      ...parsed,
      conceptsCovered: Array.isArray(parsed.conceptsCovered) ? parsed.conceptsCovered.filter((item): item is string => typeof item === "string") : [],
      requiredElements: Array.isArray(parsed.requiredElements) ? parsed.requiredElements.filter((item): item is string => typeof item === "string") : [],
      avoid: Array.isArray(parsed.avoid) ? parsed.avoid.filter((item): item is string => typeof item === "string") : [],
    } as AiImagePromptSuggestion;
  } catch {
    const imagePrompt = value.trim();
    if (!imagePrompt) return null;
    return {
      id: "ai-image-prompt",
      placement: { type: "", reference: "" },
      visualType: "",
      title: "AI Image Prompt",
      educationalPurpose: "",
      conceptsCovered: [],
      requiredElements: [],
      imagePrompt,
      avoid: [],
    };
  }
}
