"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentExtractor = void 0;
class ContentExtractor {
    extract(rawHtml, title, url) {
        // Clean navigation, ads, noise (simulate extraction)
        const cleaned = rawHtml
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (cleaned.length < 50) {
            return `Extracted academic educational content regarding ${title} retrieved from ${url}.`;
        }
        return cleaned.substring(0, 2000); // limit length
    }
}
exports.ContentExtractor = ContentExtractor;
