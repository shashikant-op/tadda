import { CourseGenerationJob } from '../types';
export declare class PipelineOrchestrator {
    private jobManager;
    private researchService;
    private curriculumService;
    private contentService;
    private visualService;
    private validationService;
    private persistenceService;
    constructor(backendToken?: string);
    runPipeline(courseName: string, branchName?: string, backendToken?: string): Promise<CourseGenerationJob>;
}
