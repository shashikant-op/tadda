"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurriculumService = void 0;
const AIProvider_1 = require("../providers/AIProvider");
class CurriculumService {
    aiProvider;
    constructor(aiProvider = (0, AIProvider_1.createAIProvider)()) {
        this.aiProvider = aiProvider;
    }
    async generateCurriculum(courseName, researchPackage) {
        if (!courseName) {
            throw new Error('Course name is required for curriculum generation.');
        }
        const context = researchPackage.sources.map(s => `${s.title}: ${s.content}`).join('\n\n');
        const prompt = `Based on the following research sources, generate a comprehensive, structured course hierarchy for "${courseName}" with logical beginner to advanced progression, topics, and subtopics.\n\nResearch Context:\n${context}`;
        const schema = `{ title: string, description: string, topics: Array<{ title: string, description: string, subtopics: Array<{ title: string, description: string }> }> }`;
        let structure;
        try {
            structure = await this.aiProvider.generateStructuredOutput(prompt, schema);
        }
        catch (err) {
            throw new Error(`Failed to generate course structure: ${err.message}`);
        }
        this.validateStructure(structure);
        console.log(`[CURRICULUM] Generated course structure for "${structure.title}" with ${structure.topics.length} topics`);
        return structure;
    }
    validateStructure(structure) {
        if (!structure || typeof structure !== 'object') {
            throw new Error('Malformed AI response: structure is not an object.');
        }
        if (!structure.title || typeof structure.title !== 'string') {
            throw new Error('Validation failed: missing or invalid course title.');
        }
        if (!Array.isArray(structure.topics) || structure.topics.length === 0) {
            throw new Error('Validation failed: topics array is missing or empty.');
        }
        const topicNames = new Set();
        for (const topic of structure.topics) {
            if (!topic.title || typeof topic.title !== 'string') {
                throw new Error('Validation failed: topic missing valid title.');
            }
            const normalizedTopicName = topic.title.trim().toLowerCase();
            if (topicNames.has(normalizedTopicName)) {
                throw new Error(`Validation failed: duplicate topic name "${topic.title}".`);
            }
            topicNames.add(normalizedTopicName);
            if (!Array.isArray(topic.subtopics) || topic.subtopics.length === 0) {
                throw new Error(`Validation failed: topic "${topic.title}" has missing or empty subtopics.`);
            }
            const subtopicNames = new Set();
            for (const sub of topic.subtopics) {
                if (!sub.title || typeof sub.title !== 'string') {
                    throw new Error(`Validation failed: subtopic in "${topic.title}" missing valid title.`);
                }
                const normalizedSubName = sub.title.trim().toLowerCase();
                if (subtopicNames.has(normalizedSubName)) {
                    throw new Error(`Validation failed: duplicate subtopic name "${sub.title}" within topic "${topic.title}".`);
                }
                subtopicNames.add(normalizedSubName);
            }
        }
    }
}
exports.CurriculumService = CurriculumService;
