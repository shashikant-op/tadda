export declare class BackendClient {
    private client;
    constructor(baseURL?: string, token?: string);
    setToken(token: string): void;
    getBranches(): Promise<any[]>;
    createBranch(data: {
        name: string;
        description?: string;
        image?: string;
    }): Promise<any>;
    getSubjects(branchId?: string): Promise<any[]>;
    createSubject(data: {
        name: string;
        branch: string;
        description?: string;
    }): Promise<any>;
    getTopics(subjectId?: string): Promise<any[]>;
    createTopic(data: {
        name: string;
        subject: string;
        description?: string;
    }): Promise<any>;
    createTutorial(data: {
        title: string;
        description: string;
        content: string;
        branch: string;
        subject: string;
        topic: string;
        status?: string;
    }): Promise<any>;
}
