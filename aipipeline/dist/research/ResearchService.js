"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResearchService = void 0;
const SearchProvider_1 = require("./SearchProvider");
const PageFetcher_1 = require("./PageFetcher");
const ContentExtractor_1 = require("./ContentExtractor");
const SourceRanker_1 = require("./SourceRanker");
class ResearchService {
    searchProvider;
    pageFetcher;
    extractor;
    ranker;
    constructor(searchProvider = (0, SearchProvider_1.createSearchProvider)(), pageFetcher = new PageFetcher_1.HttpPageFetcher()) {
        this.searchProvider = searchProvider;
        this.pageFetcher = pageFetcher;
        this.extractor = new ContentExtractor_1.ContentExtractor();
        this.ranker = new SourceRanker_1.SourceRanker();
    }
    async researchCourse(courseName) {
        if (!courseName) {
            throw new Error('Course name is required for research.');
        }
        const searchResults = await this.searchProvider.search(courseName);
        const rawSources = [];
        for (const result of searchResults) {
            let html = '';
            try {
                html = await this.pageFetcher.fetchPage(result.url);
            }
            catch (err) {
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
exports.ResearchService = ResearchService;
