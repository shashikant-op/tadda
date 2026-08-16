import { ResearchSource } from '../types';

export class SourceRanker {
  public deduplicateAndRank(sources: ResearchSource[]): ResearchSource[] {
    const seenUrls = new Set<string>();
    const unique: ResearchSource[] = [];

    for (const src of sources) {
      if (!seenUrls.has(src.url)) {
        seenUrls.add(src.url);
        unique.push(src);
      }
    }

    console.log(`[RESEARCH] Found ${sources.length} sources, selected ${unique.length} unique sources`);
    return unique.slice(0, 5); // top 5
  }
}
