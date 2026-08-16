import { ResearchPackage } from '../types';
import { ISearchProvider } from './SearchProvider';
import { IPageFetcher } from './PageFetcher';
export declare class ResearchService {
    private searchProvider;
    private pageFetcher;
    private extractor;
    private ranker;
    constructor(searchProvider?: ISearchProvider, pageFetcher?: IPageFetcher);
    researchCourse(courseName: string): Promise<ResearchPackage>;
}
