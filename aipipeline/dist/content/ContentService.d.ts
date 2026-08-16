import { GeneratedContent, ResearchPackage, Subtopic } from '../types';
import { IAIProvider } from '../providers/AIProvider';
export declare class ContentService {
    private aiProvider;
    constructor(aiProvider?: IAIProvider);
    generateSubtopicContent(courseName: string, topicTitle: string, subtopic: Subtopic, researchPackage: ResearchPackage): Promise<GeneratedContent>;
}
