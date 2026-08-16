"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CurriculumService_1 = require("../../src/curriculum/CurriculumService");
class MalformedAIProvider {
    async generateStructuredOutput(prompt, schemaDescription) {
        return { title: 'Bad Course' };
    }
    async generateText(prompt) {
        return '';
    }
}
class DuplicateTopicAIProvider {
    async generateStructuredOutput(prompt, schemaDescription) {
        return {
            title: 'Compiler Design',
            topics: [
                {
                    title: 'Introduction',
                    subtopics: [{ title: 'What is a compiler?' }]
                },
                {
                    title: 'Introduction',
                    subtopics: [{ title: 'Overview' }]
                }
            ]
        };
    }
    async generateText(prompt) {
        return '';
    }
}
const mockResearchPackage = {
    course: 'Compiler Design',
    sources: [
        { title: 'Source 1', url: 'https://example.com/1', content: 'Content 1', sourceType: 'web' }
    ]
};
describe('Curriculum Service & Structure Generator (Step 04)', () => {
    it('should generate a valid course structure', async () => {
        const service = new CurriculumService_1.CurriculumService();
        const structure = await service.generateCurriculum('Compiler Design', mockResearchPackage);
        expect(structure).toBeDefined();
        expect(structure.title).toBe('Compiler Design');
        expect(structure.topics.length).toBeGreaterThan(0);
        expect(structure.topics[0].subtopics.length).toBeGreaterThan(0);
    });
    it('should fail validation when topics are missing', () => {
        const service = new CurriculumService_1.CurriculumService();
        const badStructure = { title: 'Test' };
        expect(() => service.validateStructure(badStructure)).toThrow();
    });
    it('should fail validation on duplicate topics', () => {
        const service = new CurriculumService_1.CurriculumService();
        const duplicateStructure = {
            title: 'Test',
            topics: [
                { title: 'Intro', subtopics: [{ title: 'Sub 1' }] },
                { title: 'Intro', subtopics: [{ title: 'Sub 2' }] }
            ]
        };
        expect(() => service.validateStructure(duplicateStructure)).toThrow(/duplicate topic/i);
    });
});
