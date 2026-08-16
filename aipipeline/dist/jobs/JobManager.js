"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalJobManager = exports.JobManager = void 0;
const slugify_1 = __importDefault(require("slugify"));
class JobManager {
    jobs = new Map();
    createJob(courseName) {
        if (!courseName || typeof courseName !== 'string' || courseName.trim() === '') {
            throw new Error('Course name is required and cannot be empty or whitespace only.');
        }
        const trimmedName = courseName.trim();
        const slug = (0, slugify_1.default)(trimmedName, { lower: true, strict: true });
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const jobId = `${slug}-${timestamp}-${random}`;
        const now = new Date().toISOString();
        const job = {
            jobId,
            courseName: trimmedName,
            status: 'pending',
            createdAt: now,
            updatedAt: now,
            progress: 0,
            errors: []
        };
        this.jobs.set(jobId, job);
        console.log(`[JOB] jobId=${jobId} created for course "${trimmedName}"`);
        return job;
    }
    getJob(jobId) {
        return this.jobs.get(jobId);
    }
    updateStatus(jobId, status, progress) {
        const job = this.jobs.get(jobId);
        if (!job) {
            throw new Error(`Job not found: ${jobId}`);
        }
        job.status = status;
        job.updatedAt = new Date().toISOString();
        if (progress !== undefined) {
            job.progress = Math.min(100, Math.max(0, progress));
        }
        console.log(`[JOB] jobId=${jobId} status=${status} progress=${job.progress}%`);
        this.jobs.set(jobId, job);
        return job;
    }
    addError(jobId, step, errorMsg) {
        const job = this.jobs.get(jobId);
        if (!job) {
            throw new Error(`Job not found: ${jobId}`);
        }
        const errorEntry = {
            step,
            error: errorMsg,
            timestamp: new Date().toISOString(),
            jobId
        };
        job.errors.push(errorEntry);
        job.status = 'failed';
        job.updatedAt = new Date().toISOString();
        console.log(`[ERROR] [JOB] jobId=${jobId} step=${step} error="${errorMsg}"`);
        this.jobs.set(jobId, job);
        return job;
    }
    completeJob(jobId, result) {
        const job = this.jobs.get(jobId);
        if (!job) {
            throw new Error(`Job not found: ${jobId}`);
        }
        job.status = 'completed';
        job.progress = 100;
        job.updatedAt = new Date().toISOString();
        job.result = result;
        console.log(`[JOB] jobId=${jobId} completed successfully`);
        this.jobs.set(jobId, job);
        return job;
    }
}
exports.JobManager = JobManager;
exports.globalJobManager = new JobManager();
