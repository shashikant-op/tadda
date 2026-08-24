import { CourseGenerationJob, JobStatus } from '../types';
export declare class JobManager {
    private jobs;
    createJob(courseName: string): CourseGenerationJob;
    addLog(jobId: string, level: "DEBUG" | "INFO" | "SUCCESS" | "WARN" | "ERROR", stage: "RESEARCH" | "CURRICULUM" | "CONTENT" | "VISUAL" | "VALIDATION" | "PERSISTENCE" | "SYSTEM", message: string, metadata?: Record<string, unknown>): void;
    getJob(jobId: string): CourseGenerationJob | undefined;
    updateStatus(jobId: string, status: JobStatus, progress?: number): CourseGenerationJob;
    addError(jobId: string, step: string, errorMsg: string): CourseGenerationJob;
    completeJob(jobId: string, result: any): CourseGenerationJob;
}
export declare const globalJobManager: JobManager;
