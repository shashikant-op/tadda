"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const AIProvider_1 = require("../providers/AIProvider");
class ContentService {
    aiProvider;
    constructor(aiProvider = (0, AIProvider_1.createAIProvider)()) {
        this.aiProvider = aiProvider;
    }
    async generateSubtopicContent(courseName, topicTitle, subtopic, researchPackage) {
        if (!subtopic || !subtopic.title) {
            throw new Error('Valid subtopic is required for content generation.');
        }
        const relevantSources = researchPackage.sources.slice(0, 3);
        const context = relevantSources.map(s => `${s.title}: ${s.content}`).join('\n\n');
        const prompt = `Generate comprehensive, original educational lesson content for the subtopic "${subtopic.title}" under topic "${topicTitle}" for the course "${courseName}". Use the provided research context.\n\nResearch Context:\n${context}`;
        const schema = `{ title: string, introduction: string, sections: Array<{ title: string, content: string, examples: string[] }> }`;
        let contentResult;
        try {
            contentResult = await this.aiProvider.generateStructuredOutput(prompt, schema);
        }
        catch (err) {
            throw new Error(`Failed to generate content for subtopic "${subtopic.title}": ${err.message}`);
        }
        if (!contentResult || !contentResult.title || !contentResult.introduction || !Array.isArray(contentResult.sections)) {
            // Fallback structure if AI returns generic format
            contentResult = {
                title: subtopic.title,
                introduction: `Introduction to ${subtopic.title} in the context of ${topicTitle}.`,
                sections: [
                    {
                        title: `Core Concepts of ${subtopic.title}`,
                        content: `Detailed academic explanation of ${subtopic.title}, covering fundamental principles and definitions.`,
                        examples: [`Example implementation or scenario for ${subtopic.title}`]
                    }
                ]
            };
        }
        const sources = relevantSources.map(s => ({
            title: s.title,
            url: s.url,
            relevance: s.relevance || 'Contributed to lesson synthesis'
        }));
        console.log(`[CONTENT] Generated content for subtopic: "${subtopic.title}" with ${contentResult.sections.length} sections`);
        return {
            title: contentResult.title || subtopic.title,
            introduction: contentResult.introduction,
            sections: contentResult.sections,
            sources
        };
    }
}
exports.ContentService = ContentService;
