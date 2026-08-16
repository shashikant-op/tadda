"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PipelineOrchestrator_1 = require("../../src/pipeline/PipelineOrchestrator");
const BackendClient_1 = require("../../src/persistence/BackendClient");
class MockBackendClientForE2E extends BackendClient_1.BackendClient {
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
        return { _id: 'topic-1', ...data, slug: 'intro' };
    }
    async createTutorial(data) {
        return { _id: 'tut-1', ...data };
    }
}
describe('Full End-to-End Pipeline Test (Step 10)', () => {
    it('should run the entire Phase 1 pipeline successfully for "Compiler Design"', async () => {
        const orchestrator = new PipelineOrchestrator_1.PipelineOrchestrator();
        // override persistence client with our mock for E2E unit test verification
        orchestrator.persistenceService.client = new MockBackendClientForE2E();
        const job = await orchestrator.runPipeline('Compiler Design', 'Computer Science Engineering');
        expect(job).toBeDefined();
        expect(job.status).toBe('completed');
        expect(job.progress).toBe(100);
        expect(job.result).toBeDefined();
        const res = job.result;
        expect(res.structure).toBeDefined();
        expect(res.structure.title).toBe('Compiler Design');
        expect(res.validation.status).toBe('PASS');
        expect(res.persistence.status).toBe('success');
        expect(res.persistence.subtopicsCreated).toBeGreaterThan(0);
        expect(job.errors.length).toBe(0);
    });
});
