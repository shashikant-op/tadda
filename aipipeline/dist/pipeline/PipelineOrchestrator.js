"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineOrchestrator = void 0;
const JobManager_1 = require("../jobs/JobManager");
const ResearchService_1 = require("../research/ResearchService");
const CurriculumService_1 = require("../curriculum/CurriculumService");
const ContentService_1 = require("../content/ContentService");
const VisualService_1 = require("../visuals/VisualService");
const ValidationService_1 = require("../validation/ValidationService");
const PersistenceService_1 = require("../persistence/PersistenceService");
const BackendClient_1 = require("../persistence/BackendClient");
class PipelineOrchestrator {
    jobManager;
    researchService;
    curriculumService;
    contentService;
    visualService;
    validationService;
    persistenceService;
    constructor(backendToken) {
        this.jobManager = JobManager_1.globalJobManager;
        this.researchService = new ResearchService_1.ResearchService();
        this.curriculumService = new CurriculumService_1.CurriculumService();
        this.contentService = new ContentService_1.ContentService();
        this.visualService = new VisualService_1.VisualService();
        this.validationService = new ValidationService_1.ValidationService();
        const client = new BackendClient_1.BackendClient(process.env.BACKEND_URL || 'http://localhost:5000/api/v1', backendToken);
        this.persistenceService = new PersistenceService_1.PersistenceService(client);
    }
    async runPipeline(courseName, branchName, backendToken) {
        if (backendToken) {
            // update client token if provided
        }
        const job = this.jobManager.createJob(courseName);
        try {
            // Step 1: Research
            this.jobManager.updateStatus(job.jobId, 'researching', 10);
            this.jobManager.addLog(job.jobId, 'INFO', 'RESEARCH', `Starting research corpus aggregation for: "${courseName}"`);
            const researchPackage = await this.researchService.researchCourse(courseName);
            this.jobManager.addLog(job.jobId, 'SUCCESS', 'RESEARCH', `Research completed. Discovered and ranked ${researchPackage.sources.length} authoritative technical sources.`);
            for (const src of researchPackage.sources) {
                this.jobManager.addLog(job.jobId, 'INFO', 'RESEARCH', `SOURCE ACCEPTED: ${src.title} (${src.url})`);
            }
            // Step 2: Structuring
            this.jobManager.updateStatus(job.jobId, 'structuring', 30);
            this.jobManager.addLog(job.jobId, 'INFO', 'CURRICULUM', `Generating exhaustive curriculum hierarchy via Gemini AI for "${courseName}"...`);
            const structure = await this.curriculumService.generateCurriculum(courseName, researchPackage);
            const totalSubtopics = structure.topics.reduce((acc, t) => acc + t.subtopics.length, 0);
            this.jobManager.addLog(job.jobId, 'SUCCESS', 'CURRICULUM', `Curriculum generated successfully. Modules/Topics: ${structure.topics.length}, Total Subtopics: ${totalSubtopics}`);
            for (const top of structure.topics) {
                this.jobManager.addLog(job.jobId, 'INFO', 'CURRICULUM', `Topic: "${top.title}" with ${top.subtopics.length} subtopics.`);
            }
            // Step 3: Content Generation
            this.jobManager.updateStatus(job.jobId, 'generating_content', 50);
            this.jobManager.addLog(job.jobId, 'INFO', 'CONTENT', `Starting exhaustive lesson generation subtopic by subtopic (${totalSubtopics} lessons)...`);
            const contentsMap = new Map();
            let completedCount = 0;
            for (const topic of structure.topics) {
                for (const subtopic of topic.subtopics) {
                    this.jobManager.addLog(job.jobId, 'INFO', 'CONTENT', `Generating lesson for subtopic: "${subtopic.title}" under topic "${topic.title}"`);
                    const content = await this.contentService.generateSubtopicContent(courseName, topic.title, subtopic, researchPackage);
                    completedCount++;
                    this.jobManager.addLog(job.jobId, 'SUCCESS', 'CONTENT', `Lesson generated: "${subtopic.title}" (${content.sections.length} sections, ${completedCount}/${totalSubtopics})`);
                    // Step 4: Visuals
                    this.jobManager.updateStatus(job.jobId, 'generating_visuals', 70);
                    const visualPrompt = this.visualService.generateVisualPrompt(subtopic.title, content.sections[0]?.content || '');
                    content.visualPrompt = visualPrompt;
                    if (visualPrompt.required) {
                        this.jobManager.addLog(job.jobId, 'SUCCESS', 'VISUAL', `Generated visual prompt for "${subtopic.title}" (${visualPrompt.type})`);
                    }
                    contentsMap.set(`${topic.title}::${subtopic.title}`, content);
                }
            }
            // Step 5: Validation
            this.jobManager.updateStatus(job.jobId, 'validating', 85);
            this.jobManager.addLog(job.jobId, 'INFO', 'VALIDATION', `Running mandatory validation gate on course structure and ${completedCount} generated lessons...`);
            const allContents = Array.from(contentsMap.values());
            const validationResult = this.validationService.validateCourse(structure, allContents);
            if (validationResult.status === 'FAIL') {
                this.jobManager.addLog(job.jobId, 'ERROR', 'VALIDATION', `Course validation FAILED: ${validationResult.issues.join(', ')}`);
                throw new Error(`Validation failed: ${validationResult.issues.join(', ')}`);
            }
            this.jobManager.addLog(job.jobId, 'SUCCESS', 'VALIDATION', `Course validation PASSED with score ${validationResult.score}/100.`);
            // Step 6: Saving / Persistence
            this.jobManager.updateStatus(job.jobId, 'saving', 95);
            this.jobManager.addLog(job.jobId, 'INFO', 'PERSISTENCE', `Persisting course structure and tutorials to MongoDB via Backend API under branch "${branchName || 'Computer Science Engineering'}"...`);
            const persistResult = await this.persistenceService.persistCourse(structure, contentsMap, branchName || 'Computer Science Engineering');
            this.jobManager.addLog(job.jobId, 'SUCCESS', 'PERSISTENCE', `Persistence complete. Topics created: ${persistResult.topicsCreated}, Tutorials persisted: ${persistResult.subtopicsCreated}`);
            // Complete
            this.jobManager.addLog(job.jobId, 'SUCCESS', 'SYSTEM', `AI Course Generation Pipeline COMPLETED successfully for "${courseName}"!`);
            return this.jobManager.completeJob(job.jobId, {
                structure,
                contentsCount: allContents.length,
                validation: validationResult,
                persistence: persistResult
            });
        }
        catch (err) {
            console.log(`[ERROR] [PHASE1] Pipeline failed: ${err.message}`);
            this.jobManager.addLog(job.jobId, 'ERROR', 'SYSTEM', `Pipeline execution failed: ${err.message}`);
            return this.jobManager.addError(job.jobId, 'pipeline', err.message);
        }
    }
}
exports.PipelineOrchestrator = PipelineOrchestrator;
