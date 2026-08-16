import axios from 'axios';

export interface IPageFetcher {
  fetchPage(url: string): Promise<string>;
}

export class HttpPageFetcher implements IPageFetcher {
  public async fetchPage(url: string): Promise<string> {
    try {
      const response = await axios.get(url, { timeout: 5000, validateStatus: () => true });
      if (response.status >= 400) {
        return `Fallback content for ${url} (HTTP status ${response.status})`;
      }
      return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    } catch (err: any) {
      return `Fallback content for ${url} due to network error: ${err.message}`;
    }
  }
}
