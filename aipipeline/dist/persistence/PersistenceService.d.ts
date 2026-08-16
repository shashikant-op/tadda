import { BackendClient } from './BackendClient';
import { CourseStructure, GenerationResult } from '../types';
export declare class PersistenceService {
    private client;
    constructor(client?: BackendClient);
    persistCourse(structure: CourseStructure, contentsMap: Map<string, any>, branchName?: string): Promise<GenerationResult>;
}
