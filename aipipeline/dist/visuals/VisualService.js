"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualService = void 0;
class VisualService {
    generateVisualPrompt(subtopicTitle, sectionContent) {
        const lowerTitle = subtopicTitle.toLowerCase();
        const lowerContent = sectionContent.toLowerCase();
        const isDiagramCandidate = lowerTitle.includes('phase') || lowerTitle.includes('architecture') || lowerTitle.includes('pipeline') || lowerTitle.includes('diagram') || lowerTitle.includes('flow') || lowerTitle.includes('tree') || lowerTitle.includes('token') || lowerContent.includes('flowchart') || lowerContent.includes('diagram');
        if (!isDiagramCandidate && !lowerTitle.includes('token') && !lowerTitle.includes('tree')) {
            return {
                required: false,
                type: 'none',
                prompt: ''
            };
        }
        const visualType = lowerTitle.includes('phase') || lowerContent.includes('flow') ? 'flowchart' : 'diagram';
        const prompt = `Educational academic ${visualType} illustrating "${subtopicTitle}". Clear labels, minimal visual clutter, high contrast, clean vector style showing process flow and data transformation.`;
        console.log(`[VISUAL] Generated ${visualType} prompt for "${subtopicTitle}"`);
        return {
            required: true,
            type: visualType,
            prompt
        };
    }
}
exports.VisualService = VisualService;
