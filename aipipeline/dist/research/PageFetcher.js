"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpPageFetcher = void 0;
const axios_1 = __importDefault(require("axios"));
class HttpPageFetcher {
    async fetchPage(url) {
        try {
            const response = await axios_1.default.get(url, { timeout: 5000, validateStatus: () => true });
            if (response.status >= 400) {
                return `Fallback content for ${url} (HTTP status ${response.status})`;
            }
            return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        }
        catch (err) {
            return `Fallback content for ${url} due to network error: ${err.message}`;
        }
    }
}
exports.HttpPageFetcher = HttpPageFetcher;
