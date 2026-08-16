export interface ISearchProvider {
    search(query: string): Promise<Array<{
        title: string;
        url: string;
        snippet: string;
    }>>;
}
export declare class SerpApiSearchProvider implements ISearchProvider {
    private apiKey;
    constructor(apiKey?: string);
    search(query: string): Promise<Array<{
        title: string;
        url: string;
        snippet: string;
    }>>;
}
export declare class MockSearchProvider implements ISearchProvider {
    search(query: string): Promise<Array<{
        title: string;
        url: string;
        snippet: string;
    }>>;
}
export declare function createSearchProvider(): ISearchProvider;
