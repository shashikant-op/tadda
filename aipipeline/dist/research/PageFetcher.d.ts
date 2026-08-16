export interface IPageFetcher {
    fetchPage(url: string): Promise<string>;
}
export declare class HttpPageFetcher implements IPageFetcher {
    fetchPage(url: string): Promise<string>;
}
