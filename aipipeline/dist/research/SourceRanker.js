"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceRanker = void 0;
class SourceRanker {
    deduplicateAndRank(sources) {
        const seenUrls = new Set();
        const unique = [];
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
exports.SourceRanker = SourceRanker;
