import { CourseGenerationJob, JobStatus } from '../types';
export declare class JobManager {
    private jobs;
    createJob(courseName: string): CourseGenerationJob;
    getJob(jobId: string): CourseGenerationJob | undefined;
    updateStatus(jobId: string, status: JobStatus, progress?: number): CourseGenerationJob;
    addError(jobId: string, step: string, errorMsg: string): CourseGenerationJob;
    completeJob(jobId: string, result: any): CourseGenerationJob;
}
export declare const globalJobManager: JobManager;
