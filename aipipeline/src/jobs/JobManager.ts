import { CourseGenerationJob, JobStatus } from '../types';
import slugify from 'slugify';

export class JobManager {
  private jobs: Map<string, CourseGenerationJob> = new Map();

  public createJob(courseName: string): CourseGenerationJob {
    if (!courseName || typeof courseName !== 'string' || courseName.trim() === '') {
      throw new Error('Course name is required and cannot be empty or whitespace only.');
    }

    const trimmedName = courseName.trim();
    const slug = slugify(trimmedName, { lower: true, strict: true });
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const jobId = `${slug}-${timestamp}-${random}`;

    const now = new Date().toISOString();
    const job: CourseGenerationJob = {
      jobId,
      courseName: trimmedName,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      progress: 0,
      errors: [],
      logs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          level: 'INFO',
          stage: 'SYSTEM',
          message: `Pipeline initialized for course "${trimmedName}" (ID: ${jobId})`
        }
      ]
    };

    this.jobs.set(jobId, job);
    console.log(`[JOB] jobId=${jobId} created for course "${trimmedName}"`);
    return job;
  }

  public addLog(jobId: string, level: "DEBUG" | "INFO" | "SUCCESS" | "WARN" | "ERROR", stage: "RESEARCH" | "CURRICULUM" | "CONTENT" | "VISUAL" | "VALIDATION" | "PERSISTENCE" | "SYSTEM", message: string, metadata?: Record<string, unknown>): void {
    const job = this.jobs.get(jobId);
    if (!job) return;
    const logEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      stage,
      message,
      metadata
    };
    job.logs.push(logEntry);
    job.updatedAt = new Date().toISOString();
    console.log(`[${level}] [${stage}] ${message}`);
  }

  public getJob(jobId: string): CourseGenerationJob | undefined {
    return this.jobs.get(jobId);
  }

  public updateStatus(jobId: string, status: JobStatus, progress?: number): CourseGenerationJob {
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

  public addError(jobId: string, step: string, errorMsg: string): CourseGenerationJob {
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

  public completeJob(jobId: string, result: any): CourseGenerationJob {
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

export const globalJobManager = new JobManager();
