import axios, { AxiosInstance } from 'axios';

export class BackendClient {
  private client: AxiosInstance;

  constructor(baseURL: string = process.env.BACKEND_URL || 'http://localhost:5000/api/v1', token?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      validateStatus: () => true
    });
  }

  public setToken(token: string) {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  public async getBranches(): Promise<any[]> {
    const res = await this.client.get('/branches');
    if (res.status >= 400) {
      throw new Error(`Failed to fetch branches: ${res.data?.message || res.statusText}`);
    }
    return res.data.data?.branches || res.data.branches || [];
  }

  public async createBranch(data: { name: string; description?: string; image?: string }): Promise<any> {
    const res = await this.client.post('/branches', data);
    if (res.status >= 400) {
      throw new Error(`Failed to create branch: ${res.data?.message || res.statusText}`);
    }
    return res.data.data?.branch || res.data.branch || res.data.data;
  }

  public async getSubjects(branchId?: string): Promise<any[]> {
    const url = branchId ? `/subjects?branch=${branchId}` : '/subjects';
    const res = await this.client.get(url);
    if (res.status >= 400) {
      throw new Error(`Failed to fetch subjects: ${res.data?.message || res.statusText}`);
    }
    return res.data.data?.subjects || res.data.subjects || [];
  }

  public async createSubject(data: { name: string; branch: string; description?: string }): Promise<any> {
    const res = await this.client.post('/subjects', data);
    if (res.status >= 400) {
      throw new Error(`Failed to create subject: ${res.data?.message || res.statusText}`);
    }
    return res.data.data?.subject || res.data.subject || res.data.data;
  }

  public async getTopics(subjectId?: string): Promise<any[]> {
    const url = subjectId ? `/topics?subject=${subjectId}` : '/topics';
    const res = await this.client.get(url);
    if (res.status >= 400) {
      throw new Error(`Failed to fetch topics: ${res.data?.message || res.statusText}`);
    }
    return res.data.data?.topics || res.data.topics || [];
  }

  public async createTopic(data: { name: string; subject: string; description?: string }): Promise<any> {
    const res = await this.client.post('/topics', data);
    if (res.status >= 400) {
      throw new Error(`Failed to create topic: ${res.data?.message || res.statusText}`);
    }
    return res.data.data?.topic || res.data.topic || res.data.data;
  }

  public async createTutorial(data: {
    title: string;
    description: string;
    content: string;
    branch: string;
    subject: string;
    topic: string;
    status?: string;
  }): Promise<any> {
    const res = await this.client.post('/tutorials', data);
    if (res.status >= 400) {
      throw new Error(`Failed to create tutorial/subtopic: ${res.data?.message || res.statusText}`);
    }
    return res.data.data?.tutorial || res.data.tutorial || res.data.data;
  }
}
