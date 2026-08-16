import { ResearchPackage, ResearchSource } from '../types';
import { ISearchProvider, createSearchProvider } from './SearchProvider';
import { IPageFetcher, HttpPageFetcher } from './PageFetcher';
import { ContentExtractor } from './ContentExtractor';
import { SourceRanker } from './SourceRanker';

export class ResearchService {
  private searchProvider: ISearchProvider;
  private pageFetcher: IPageFetcher;
  private extractor: ContentExtractor;
  private ranker: SourceRanker;

    constructor(
      searchProvider: ISearchProvider = createSearchProvider(),
      pageFetcher: IPageFetcher = new HttpPageFetcher()
    ) {
    this.searchProvider = searchProvider;
    this.pageFetcher = pageFetcher;
    this.extractor = new ContentExtractor();
    this.ranker = new SourceRanker();
  }

  public async researchCourse(courseName: string): Promise<ResearchPackage> {
    if (!courseName) {
      throw new Error('Course name is required for research.');
    }

    const searchResults = await this.searchProvider.search(courseName);
    const rawSources: ResearchSource[] = [];

    for (const result of searchResults) {
      let html = '';
      try {
        html = await this.pageFetcher.fetchPage(result.url);
      } catch (err: any) {
        html = `Fallback content for ${result.url} due to error: ${err.message}`;
      }
      const extractedContent = this.extractor.extract(html, result.title, result.url);
      rawSources.push({
        title: result.title,
        url: result.url,
        content: extractedContent || result.snippet,
        sourceType: 'web',
        relevance: result.snippet
      });
    }

    const rankedSources = this.ranker.deduplicateAndRank(rawSources);

    return {
      course: courseName,
      sources: rankedSources
    };
  }
}
