"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSearchProvider = exports.SerpApiSearchProvider = void 0;
exports.createSearchProvider = createSearchProvider;
const axios_1 = __importDefault(require("axios"));
class SerpApiSearchProvider {
    apiKey;
    constructor(apiKey = process.env.SERP_API_KEY || '') {
        this.apiKey = apiKey;
    }
    async search(query) {
        if (!this.apiKey) {
            throw new Error('SERP_API_KEY is missing');
        }
        try {
            console.log(`[RESEARCH] Scraping Google via SerpApi for query: "${query}"`);
            const url = `https://serpapi.com/search?engine=google&q=${encodeURIComponent(query)}&api_key=${this.apiKey}`;
            const response = await axios_1.default.get(url, { timeout: 10000 });
            const organicResults = response.data?.organic_results || [];
            if (organicResults.length === 0) {
                console.log(`[RESEARCH] No SerpApi organic results found, falling back to mock search.`);
                const mock = new MockSearchProvider();
                return await mock.search(query);
            }
            return organicResults.map((r) => ({
                title: r.title || query,
                url: r.link || 'https://example.com',
                snippet: r.snippet || r.about_this_result_str || `Information regarding ${query}`
            }));
        }
        catch (err) {
            console.log(`[RESEARCH] SerpApi error (${err.message}), falling back to mock search.`);
            const mock = new MockSearchProvider();
            return await mock.search(query);
        }
    }
}
exports.SerpApiSearchProvider = SerpApiSearchProvider;
class MockSearchProvider {
    async search(query) {
        console.log(`[RESEARCH] Searching mock sources for "${query}"`);
        return [
            {
                title: `${query} Introduction and Overview`,
                url: `https://example.com/${encodeURIComponent(query)}-intro`,
                snippet: `Comprehensive introduction to ${query}, covering core concepts, architecture, and principles.`
            },
            {
                title: `Phases and Mechanics of ${query}`,
                url: `https://example.com/${encodeURIComponent(query)}-phases`,
                snippet: `Detailed analysis of the various phases and algorithms involved in ${query}.`
            },
            {
                title: `Advanced ${query} Optimization`,
                url: `https://example.com/${encodeURIComponent(query)}-advanced`,
                snippet: `Advanced techniques, optimizations, and practical applications of ${query}.`
            },
            {
                title: `Practical Guide to ${query}`,
                url: `https://example.com/${encodeURIComponent(query)}-guide`,
                snippet: `Step-by-step practical guide and examples for implementing ${query}.`
            }
        ];
    }
}
exports.MockSearchProvider = MockSearchProvider;
function createSearchProvider() {
    if (process.env.SERP_API_KEY) {
        return new SerpApiSearchProvider(process.env.SERP_API_KEY);
    }
    return new MockSearchProvider();
}
