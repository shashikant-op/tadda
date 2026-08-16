"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceService = void 0;
const BackendClient_1 = require("./BackendClient");
const slugify_1 = __importDefault(require("slugify"));
class PersistenceService {
    client;
    constructor(client = new BackendClient_1.BackendClient()) {
        this.client = client;
    }
    async persistCourse(structure, contentsMap, branchName = 'Computer Science Engineering') {
        console.log(`[DATABASE] Starting persistence for course "${structure.title}" under branch "${branchName}"`);
        // 1. Find or create Branch
        const branches = await this.client.getBranches();
        const branchSlug = (0, slugify_1.default)(branchName, { lower: true, strict: true });
        let branch = branches.find((b) => b.slug === branchSlug || b.name.toLowerCase() === branchName.toLowerCase());
        if (!branch) {
            branch = await this.client.createBranch({
                name: branchName,
                description: `Engineering branch for ${branchName}`
            });
        }
        const branchId = branch.id || branch._id;
        // 2. Find or create Subject (Course)
        const subjects = await this.client.getSubjects(branchId);
        const subjectSlug = (0, slugify_1.default)(structure.title, { lower: true, strict: true });
        let subject = subjects.find((s) => s.slug === subjectSlug || s.name.toLowerCase() === structure.title.toLowerCase());
        if (!subject) {
            subject = await this.client.createSubject({
                name: structure.title,
                branch: branchId,
                description: structure.description || `Comprehensive course on ${structure.title}`
            });
        }
        const subjectId = subject.id || subject._id;
        let topicsCreated = 0;
        let subtopicsCreated = 0;
        // 3. Topics and Subtopics / Tutorials
        const existingTopics = await this.client.getTopics(subjectId);
        for (const t of structure.topics) {
            const topicSlug = (0, slugify_1.default)(t.title, { lower: true, strict: true });
            let topic = existingTopics.find((tp) => tp.slug === topicSlug || tp.name.toLowerCase() === t.title.toLowerCase());
            if (!topic) {
                topic = await this.client.createTopic({
                    name: t.title,
                    subject: subjectId,
                    description: t.description || `Topic section for ${t.title}`
                });
                topicsCreated++;
            }
            const topicId = topic.id || topic._id;
            for (const sub of t.subtopics) {
                const contentKey = `${t.title}::${sub.title}`;
                const generatedContent = contentsMap.get(contentKey) || {
                    title: sub.title,
                    introduction: `Introduction to ${sub.title}.`,
                    sections: [{ title: sub.title, content: sub.description || `Detailed lesson on ${sub.title}.`, examples: [] }],
                    sources: []
                };
                const markdownContent = `# ${generatedContent.title}\n\n${generatedContent.introduction}\n\n` +
                    generatedContent.sections.map((s) => `## ${s.title}\n\n${s.content}\n\n${s.examples?.length ? '### Examples\n' + s.examples.join('\n') : ''}`).join('\n\n') +
                    (generatedContent.visualPrompt?.required ? `\n\n### Visual Prompt\n> Type: ${generatedContent.visualPrompt.type}\n> ${generatedContent.visualPrompt.prompt}\n` : '');
                try {
                    await this.client.createTutorial({
                        title: sub.title,
                        description: sub.description || generatedContent.introduction,
                        content: markdownContent,
                        branch: branchId,
                        subject: subjectId,
                        topic: topicId,
                        status: 'published'
                    });
                    subtopicsCreated++;
                }
                catch (err) {
                    console.log(`[DATABASE] Warning: could not create tutorial for "${sub.title}": ${err.message}`);
                }
            }
        }
        console.log(`[DATABASE] Persistence complete. Topics created: ${topicsCreated}, Tutorials/Subtopics created: ${subtopicsCreated}`);
        return {
            courseId: subjectId,
            branchId,
            subjectId,
            topicsCreated,
            subtopicsCreated,
            status: 'success'
        };
    }
}
exports.PersistenceService = PersistenceService;
