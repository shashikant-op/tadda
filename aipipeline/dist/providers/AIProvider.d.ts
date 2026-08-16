export interface IAIProvider {
    generateStructuredOutput<T>(prompt: string, schemaDescription: string): Promise<T>;
    generateText(prompt: string): Promise<string>;
}
export declare class MockAIProvider implements IAIProvider {
    generateStructuredOutput<T>(prompt: string, schemaDescription: string): Promise<T>;
    generateText(prompt: string): Promise<string>;
}
export declare class GeminiAIProvider implements IAIProvider {
    private apiKey;
    private model;
    constructor(apiKey?: string, model?: string);
    generateStructuredOutput<T>(prompt: string, schemaDescription: string): Promise<T>;
    generateText(prompt: string): Promise<string>;
}
export declare function createAIProvider(): IAIProvider;
