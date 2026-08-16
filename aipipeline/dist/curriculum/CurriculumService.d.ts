import { CourseStructure, ResearchPackage } from '../types';
import { IAIProvider } from '../providers/AIProvider';
export declare class CurriculumService {
    private aiProvider;
    constructor(aiProvider?: IAIProvider);
    generateCurriculum(courseName: string, researchPackage: ResearchPackage): Promise<CourseStructure>;
    validateStructure(structure: any): void;
}
