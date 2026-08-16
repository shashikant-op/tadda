"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PersistenceService_1 = require("../../src/persistence/PersistenceService");
const BackendClient_1 = require("../../src/persistence/BackendClient");
class MockBackendClient extends BackendClient_1.BackendClient {
    constructor() {
        super('http://localhost:5000/api/v1', 'mock-token');
    }
    async getBranches() {
        return [{ _id: 'branch-1', name: 'Computer Science Engineering', slug: 'computer-science-engineering' }];
    }
    async createBranch(data) {
        return { _id: 'branch-1', ...data, slug: 'computer-science-engineering' };
    }
    async getSubjects(branchId) {
        return [];
    }
    async createSubject(data) {
        return { _id: 'subject-1', ...data, slug: 'compiler-design' };
    }
    async getTopics(subjectId) {
        return [];
    }
    async createTopic(data) {
        return { _id: 'topic-1', ...data, slug: 'introduction-to-compiler' };
    }
    async createTutorial(data) {
        return { _id: 'tut-1', ...data };
    }
}
describe('Persistence Service & Backend API Integration (Step 08)', () => {
    it('should successfully persist course structure and content using backend client', async () => {
        const mockClient = new MockBackendClient();
        const service = new PersistenceService_1.PersistenceService(mockClient);
        const structure = {
            title: 'Compiler Design',
            topics: [
                {
                    title: 'Introduction to Compiler',
                    subtopics: [{ title: 'What is a Compiler?' }]
                }
            ]
        };
        const contentsMap = new Map();
        contentsMap.set('Introduction to Compiler::What is a Compiler?', {
            title: 'What is a Compiler?',
            introduction: 'A compiler translates source code.',
            sections: [{ title: 'Overview', content: 'Translates high-level to low-level code.', examples: [] }],
            sources: []
        });
        const result = await service.persistCourse(structure, contentsMap);
        expect(result).toBeDefined();
        expect(result.status).toBe('success');
        expect(result.subjectId).toBe('subject-1');
        expect(result.subtopicsCreated).toBe(1);
    });
});
