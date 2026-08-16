"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiAIProvider = exports.MockAIProvider = void 0;
exports.createAIProvider = createAIProvider;
const axios_1 = __importDefault(require("axios"));
class MockAIProvider {
    async generateStructuredOutput(prompt, schemaDescription) {
        console.log(`[AI] Generating dynamic mock structured output for prompt length ${prompt.length}`);
        // Extract course name if present in prompt
        let courseName = 'Dynamic Course';
        const match = prompt.match(/for "([^"]+)"/i) || prompt.match(/for ([A-Za-z\s]+)\./i);
        if (match && match[1]) {
            courseName = match[1].trim();
        }
        if (schemaDescription.includes('topics')) {
            return {
                title: courseName,
                description: `Comprehensive academic curriculum for ${courseName}.`,
                topics: [
                    {
                        title: `Introduction to ${courseName}`,
                        description: `Foundational concepts and overview of ${courseName}.`,
                        subtopics: [
                            { title: `What is ${courseName}?`, description: `Core definition and background of ${courseName}.` },
                            { title: `Key Principles of ${courseName}`, description: `Fundamental rules and architecture.` }
                        ]
                    },
                    {
                        title: `Advanced ${courseName} Concepts`,
                        description: `Deep dive into advanced mechanics and practices.`,
                        subtopics: [
                            { title: `Implementation Techniques`, description: `Practical application methods.` },
                            { title: `Case Studies & Optimization`, description: `Real-world use cases and performance tuning.` }
                        ]
                    }
                ]
            };
        }
        if (schemaDescription.includes('introduction') || schemaDescription.includes('sections')) {
            let subtopicTitle = 'Lesson Content';
            const subMatch = prompt.match(/for the subtopic "([^"]+)"/i);
            if (subMatch && subMatch[1]) {
                subtopicTitle = subMatch[1].trim();
            }
            return {
                title: subtopicTitle,
                introduction: `Detailed educational overview and principles of ${subtopicTitle}.`,
                sections: [
                    {
                        title: `Core Concepts of ${subtopicTitle}`,
                        content: `In-depth technical explanation of ${subtopicTitle}.`,
                        examples: [`Example demonstrating ${subtopicTitle}`]
                    }
                ]
            };
        }
        return {
            title: 'Default Course',
            description: 'Default description',
            topics: [],
            sections: []
        };
    }
    async generateText(prompt) {
        return `Dynamic mock educational response for: ${prompt.substring(0, 50)}...`;
    }
}
exports.MockAIProvider = MockAIProvider;
class GeminiAIProvider {
    apiKey;
    model;
    constructor(apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '', model = process.env.AI_MODEL || 'gemini-1.5-flash') {
        this.apiKey = apiKey;
        this.model = model;
    }
    async generateStructuredOutput(prompt, schemaDescription) {
        if (!this.apiKey) {
            throw new Error('AI API Key is missing for GeminiAIProvider. Please set AI_API_KEY environment variable.');
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const enhancedPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON matching this exact schema: ${schemaDescription}. Do not include markdown code blocks or explanatory text.`;
        try {
            const response = await axios_1.default.post(url, {
                contents: [
                    {
                        parts: [{ text: enhancedPrompt }]
                    }
                ],
                generationConfig: {
                    responseMimeType: 'application/json'
                }
            });
            const candidate = response.data?.candidates?.[0];
            const textResponse = candidate?.content?.parts?.[0]?.text;
            if (!textResponse) {
                throw new Error('Received empty response from Gemini API');
            }
            // Clean markdown code blocks if any
            let cleanJson = textResponse.trim();
            if (cleanJson.startsWith('```json')) {
                cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
            }
            else if (cleanJson.startsWith('```')) {
                cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
            }
            return JSON.parse(cleanJson);
        }
        catch (err) {
            console.error(`[AI] Gemini API error (${err.message}), falling back to dynamic mock provider.`);
            const mock = new MockAIProvider();
            return await mock.generateStructuredOutput(prompt, schemaDescription);
        }
    }
    async generateText(prompt) {
        if (!this.apiKey) {
            throw new Error('AI API Key is missing for GeminiAIProvider');
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const response = await axios_1.default.post(url, {
            contents: [{ parts: [{ text: prompt }] }]
        });
        const candidate = response.data?.candidates?.[0];
        return candidate?.content?.parts?.[0]?.text || '';
    }
}
exports.GeminiAIProvider = GeminiAIProvider;
function createAIProvider() {
    const providerType = process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY || process.env.AI_API_KEY ? 'gemini' : 'mock');
    if (providerType === 'gemini' || providerType === 'openai' || process.env.GEMINI_API_KEY || process.env.AI_API_KEY) {
        return new GeminiAIProvider();
    }
    return new MockAIProvider();
}
