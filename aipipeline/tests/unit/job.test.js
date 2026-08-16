"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JobManager_1 = require("../../src/jobs/JobManager");
describe('JobManager (Step 02)', () => {
    let jobManager;
    beforeEach(() => {
        jobManager = new JobManager_1.JobManager();
    });
    it('should create a job with valid course name', () => {
        const job = jobManager.createJob('Compiler Design');
        expect(job).toBeDefined();
        expect(job.courseName).toBe('Compiler Design');
        expect(job.status).toBe('pending');
        expect(job.jobId).toContain('compiler-design');
        expect(job.progress).toBe(0);
        expect(job.errors).toEqual([]);
    });
    it('should throw an error for empty course name', () => {
        expect(() => jobManager.createJob('')).toThrow();
    });
    it('should throw an error for whitespace-only course name', () => {
        expect(() => jobManager.createJob('   ')).toThrow();
    });
    it('should update job status and progress', () => {
        const job = jobManager.createJob('Compiler Design');
        const updated = jobManager.updateStatus(job.jobId, 'researching', 20);
        expect(updated.status).toBe('researching');
        expect(updated.progress).toBe(20);
        expect(updated.updatedAt).toBeDefined();
    });
    it('should record job failure and add error', () => {
        const job = jobManager.createJob('Compiler Design');
        const failed = jobManager.addError(job.jobId, 'research', 'Network timeout');
        expect(failed.status).toBe('failed');
        expect(failed.errors.length).toBe(1);
        expect(failed.errors[0].step).toBe('research');
        expect(failed.errors[0].error).toBe('Network timeout');
    });
    it('should complete job successfully', () => {
        const job = jobManager.createJob('Compiler Design');
        const completed = jobManager.completeJob(job.jobId, { topicsCreated: 5 });
        expect(completed.status).toBe('completed');
        expect(completed.progress).toBe(100);
        expect(completed.result).toEqual({ topicsCreated: 5 });
    });
    it('should throw error when updating non-existent job', () => {
        expect(() => jobManager.updateStatus('non-existent', 'researching', 10)).toThrow();
    });
});
