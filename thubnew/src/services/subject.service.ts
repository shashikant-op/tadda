import { axiosInstance } from "@/lib/axios";
import { Subject } from "@/types";

const CACHE_KEY = "thub_subjects_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const subjectRequests = new Map<string, Promise<Subject[]>>();

export const subjectService = {
  getSubjects: async (branchId?: string): Promise<Subject[]> => {
    const cacheKey = `${CACHE_KEY}_${branchId || "all"}`;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          return JSON.parse(cached);
        }
      } catch {}
    }

    const existingRequest = subjectRequests.get(cacheKey);
    if (existingRequest) return existingRequest;

    const url = branchId ? `/subjects?branch=${branchId}` : "/subjects";
    const request = axiosInstance.get(url).then((res) => {
      const data = res.data.data.subjects || res.data.data;
      const list = Array.isArray(data) ? data : [];
      const subjects = list.map((s: Record<string, unknown>) => ({ ...(s as unknown as Subject), id: (s.id || s._id) as string }));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(subjects));
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        } catch {}
      }
      return subjects;
    }).finally(() => subjectRequests.delete(cacheKey));

    subjectRequests.set(cacheKey, request);
    return request;
  },
  getSubjectBySlug: async (slug: string): Promise<Subject> => {
    const cacheKey = `${CACHE_KEY}_slug_${slug}`;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          return JSON.parse(cached);
        }
      } catch {}
    }

    const res = await axiosInstance.get(`/subjects/${slug}`);
    const s = res.data.data.subject || res.data.data;
    const subject = {
      ...(s as unknown as Subject),
      id: (s.id || s._id) as string,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(subject));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      } catch {}
    }

    return subject;
  },
};
