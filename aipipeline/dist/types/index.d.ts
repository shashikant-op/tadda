export type JobStatus = 'pending' | 'researching' | 'structuring' | 'generating_content' | 'generating_visuals' | 'validating' | 'saving' | 'completed' | 'failed';
export interface PipelineLog {
    timestamp: string;
    level: "DEBUG" | "INFO" | "SUCCESS" | "WARN" | "ERROR";
    stage: "RESEARCH" | "CURRICULUM" | "CONTENT" | "VISUAL" | "VALIDATION" | "PERSISTENCE" | "SYSTEM";
    message: string;
    metadata?: Record<string, unknown>;
}
export interface CourseGenerationJob {
    jobId: string;
    courseName: string;
    status: JobStatus;
    createdAt: string;
    updatedAt: string;
    progress: number;
    errors: Array<{
        step: string;
        error: string;
        timestamp: string;
        jobId: string;
    }>;
    logs: PipelineLog[];
    result?: GenerationResult;
}
export interface ResearchSource {
    title: string;
    url: string;
    content: string;
    sourceType: string;
    relevance?: string;
}
export interface ResearchPackage {
    course: string;
    sources: ResearchSource[];
}
export interface Subtopic {
    title: string;
    description?: string;
}
export interface Topic {
    title: string;
    description?: string;
    subtopics: Subtopic[];
}
export interface CourseStructure {
    title: string;
    branchName?: string;
    description?: string;
    topics: Topic[];
}
export interface GeneratedSection {
    title: string;
    content: string;
    examples: string[];
}
export interface VisualPrompt {
    required: boolean;
    type: string;
    prompt: string;
}
export interface GeneratedContent {
    title: string;
    introduction: string;
    sections: GeneratedSection[];
    visualPrompt?: VisualPrompt;
    sources: Array<{
        title: string;
        url: string;
        relevance: string;
    }>;
}
export interface ValidationResult {
    status: 'PASS' | 'FAIL';
    score: number;
    issues: string[];
    warnings: string[];
}
export interface GenerationResult {
    courseId?: string;
    branchId?: string;
    subjectId?: string;
    topicsCreated: number;
    subtopicsCreated: number;
    status: string;
    structure?: CourseStructure;
    contentsCount?: number;
    validation?: ValidationResult;
    persistence?: any;
}
