import { ResearchService } from '../../src/research/ResearchService';
import { ISearchProvider, MockSearchProvider } from '../../src/research/SearchProvider';
import { IPageFetcher } from '../../src/research/PageFetcher';

class FailingSearchProvider implements ISearchProvider {
  async search(query: string): Promise<any[]> {
    throw new Error('Search API failure');
  }
}

class EmptySearchProvider implements ISearchProvider {
  async search(query: string): Promise<any[]> {
    return [];
  }
}

class DuplicateSearchProvider implements ISearchProvider {
  async search(query: string): Promise<any[]> {
    return [
      { title: 'Doc 1', url: 'https://example.com/doc1', snippet: 'Snippet 1' },
      { title: 'Doc 1 Duplicate', url: 'https://example.com/doc1', snippet: 'Snippet 1 dup' }
    ];
  }
}

class FailingPageFetcher implements IPageFetcher {
  async fetchPage(url: string): Promise<string> {
    throw new Error('Fetch timeout');
  }
}

describe('Research Layer (Step 03)', () => {
  it('should successfully research a course with multiple sources', async () => {
    const service = new ResearchService();
    const pkg = await service.researchCourse('Compiler Design');

    expect(pkg).toBeDefined();
    expect(pkg.course).toBe('Compiler Design');
    expect(pkg.sources.length).toBeGreaterThan(0);
    expect(pkg.sources[0].title).toBeDefined();
    expect(pkg.sources[0].url).toBeDefined();
    expect(pkg.sources[0].content).toBeDefined();
  });

  it('should handle zero sources gracefully', async () => {
    const service = new ResearchService(new EmptySearchProvider());
    const pkg = await service.researchCourse('Unknown Course');

    expect(pkg.sources).toEqual([]);
  });

  it('should deduplicate sources correctly', async () => {
    const service = new ResearchService(new DuplicateSearchProvider());
    const pkg = await service.researchCourse('Compiler Design');

    expect(pkg.sources.length).toBe(1);
    expect(pkg.sources[0].url).toBe('https://example.com/doc1');
  });

  it('should throw error on search failure', async () => {
    const service = new ResearchService(new FailingSearchProvider());
    await expect(service.researchCourse('Compiler Design')).rejects.toThrow('Search API failure');
  });

  it('should handle fetch failures with fallback content', async () => {
    const service = new ResearchService(new MockSearchProvider(), new FailingPageFetcher());
    const pkg = await service.researchCourse('Compiler Design');

    expect(pkg.sources.length).toBeGreaterThan(0);
    expect(pkg.sources[0].content).toContain('Fetch timeout');
  });
});
