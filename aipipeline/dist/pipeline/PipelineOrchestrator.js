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
            const researchPackage = await this.researchService.researchCourse(courseName);
            // Step 2: Structuring
            this.jobManager.updateStatus(job.jobId, 'structuring', 30);
            const structure = await this.curriculumService.generateCurriculum(courseName, researchPackage);
            // Step 3: Content Generation
            this.jobManager.updateStatus(job.jobId, 'generating_content', 50);
            const contentsMap = new Map();
            for (const topic of structure.topics) {
                for (const subtopic of topic.subtopics) {
                    const content = await this.contentService.generateSubtopicContent(courseName, topic.title, subtopic, researchPackage);
                    // Step 4: Visuals
                    this.jobManager.updateStatus(job.jobId, 'generating_visuals', 70);
                    const visualPrompt = this.visualService.generateVisualPrompt(subtopic.title, content.sections[0]?.content || '');
                    content.visualPrompt = visualPrompt;
                    contentsMap.set(`${topic.title}::${subtopic.title}`, content);
                }
            }
            // Step 5: Validation
            this.jobManager.updateStatus(job.jobId, 'validating', 85);
            const allContents = Array.from(contentsMap.values());
            const validationResult = this.validationService.validateCourse(structure, allContents);
            if (validationResult.status === 'FAIL') {
                throw new Error(`Validation failed: ${validationResult.issues.join(', ')}`);
            }
            // Step 6: Saving / Persistence
            this.jobManager.updateStatus(job.jobId, 'saving', 95);
            const persistResult = await this.persistenceService.persistCourse(structure, contentsMap, branchName || 'Computer Science Engineering');
            // Complete
            return this.jobManager.completeJob(job.jobId, {
                structure,
                contentsCount: allContents.length,
                validation: validationResult,
                persistence: persistResult
            });
        }
        catch (err) {
            console.log(`[ERROR] [PHASE1] Pipeline failed: ${err.message}`);
            return this.jobManager.addError(job.jobId, 'pipeline', err.message);
        }
    }
}
exports.PipelineOrchestrator = PipelineOrchestrator;
