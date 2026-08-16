"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendClient = void 0;
const axios_1 = __importDefault(require("axios"));
class BackendClient {
    client;
    constructor(baseURL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1', token) {
        this.client = axios_1.default.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            validateStatus: () => true
        });
    }
    setToken(token) {
        this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    async getBranches() {
        const res = await this.client.get('/branches');
        if (res.status >= 400) {
            throw new Error(`Failed to fetch branches: ${res.data?.message || res.statusText}`);
        }
        return res.data.data?.branches || res.data.branches || [];
    }
    async createBranch(data) {
        const res = await this.client.post('/branches', data);
        if (res.status >= 400) {
            throw new Error(`Failed to create branch: ${res.data?.message || res.statusText}`);
        }
        return res.data.data?.branch || res.data.branch || res.data.data;
    }
    async getSubjects(branchId) {
        const url = branchId ? `/subjects?branch=${branchId}` : '/subjects';
        const res = await this.client.get(url);
        if (res.status >= 400) {
            throw new Error(`Failed to fetch subjects: ${res.data?.message || res.statusText}`);
        }
        return res.data.data?.subjects || res.data.subjects || [];
    }
    async createSubject(data) {
        const res = await this.client.post('/subjects', data);
        if (res.status >= 400) {
            throw new Error(`Failed to create subject: ${res.data?.message || res.statusText}`);
        }
        return res.data.data?.subject || res.data.subject || res.data.data;
    }
    async getTopics(subjectId) {
        const url = subjectId ? `/topics?subject=${subjectId}` : '/topics';
        const res = await this.client.get(url);
        if (res.status >= 400) {
            throw new Error(`Failed to fetch topics: ${res.data?.message || res.statusText}`);
        }
        return res.data.data?.topics || res.data.topics || [];
    }
    async createTopic(data) {
        const res = await this.client.post('/topics', data);
        if (res.status >= 400) {
            throw new Error(`Failed to create topic: ${res.data?.message || res.statusText}`);
        }
        return res.data.data?.topic || res.data.topic || res.data.data;
    }
    async createTutorial(data) {
        const res = await this.client.post('/tutorials', data);
        if (res.status >= 400) {
            throw new Error(`Failed to create tutorial/subtopic: ${res.data?.message || res.statusText}`);
        }
        return res.data.data?.tutorial || res.data.tutorial || res.data.data;
    }
}
exports.BackendClient = BackendClient;
