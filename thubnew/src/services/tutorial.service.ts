import { axiosInstance } from "@/lib/axios";
import { Tutorial, Branch } from "@/types";
import { API_BASE_URL } from "@/lib/constants";

const CACHE_KEY = "thub_tutorials_cache_v7";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const tutorialRequests = new Map<string, Promise<Tutorial>>();
const curriculumRequests = new Map<string, Promise<Tutorial[]>>();
const curriculumCache = new Map<string, { data: Tutorial[]; expiresAt: number }>();
const apiOrigin = new URL(API_BASE_URL).origin;

const normalizeTutorial = (tutorial: Record<string, unknown>): Tutorial => ({
  ...(tutorial as unknown as Tutorial),
  id: (tutorial.id || tutorial._id) as string,
  content: typeof tutorial.content === "string"
    ? tutorial.content.replaceAll("](/api/v1/tutorials/", `](${apiOrigin}/api/v1/tutorials/`)
    : "",
});

export const tutorialService = {
  getBranches: async (): Promise<Branch[]> => {
    const cacheKey = `${CACHE_KEY}_branches`;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          return JSON.parse(cached);
        }
      } catch {}
    }

    const res = await axiosInstance.get("/branches");
    const data = res.data.data.branches || res.data.data;
    const list = Array.isArray(data) ? data : [];
    const branches = list.map((b: Record<string, unknown>) => ({
      ...(b as unknown as Branch),
      id: (b.id || b._id) as string,
    }));

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(branches));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      } catch {}
    }

    return branches;
  },

  getTutorials: async (branchId?: string, subjectSlug?: string, includeDrafts = false): Promise<Tutorial[]> => {
    const params = new URLSearchParams({ limit: "100", page: "1" });
    if (branchId) params.set("branch", branchId);
    if (subjectSlug) params.set("subject", subjectSlug);
    if (includeDrafts) params.set("status", "all");

    const firstResponse = await axiosInstance.get(`/tutorials?${params.toString()}`);
    const firstData = firstResponse.data.data;
    const firstList = Array.isArray(firstData) ? firstData : (firstData?.tutorials || firstData?.data || []);
    const combined = Array.isArray(firstList) ? [...firstList] : [];
    const totalPages = Number(firstData?.pagination?.totalPages || 1);

    for (let page = 2; page <= totalPages; page += 1) {
      params.set("page", String(page));
      const response = await axiosInstance.get(`/tutorials?${params.toString()}`);
      const pageData = response.data.data;
      const pageList = Array.isArray(pageData) ? pageData : (pageData?.tutorials || pageData?.data || []);
      if (Array.isArray(pageList)) combined.push(...pageList);
    }

    const tutorials = (combined as Record<string, unknown>[]).map((t) => ({
      ...(t as unknown as Tutorial),
      id: (t.id || t._id) as string,
    }));

    return tutorials;
  },

  getCurriculum: async (branchSlug: string, subjectSlug: string): Promise<Tutorial[]> => {
    const key = `${branchSlug}/${subjectSlug}`;
    const cached = curriculumCache.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.data;
    const existing = curriculumRequests.get(key);
    if (existing) return existing;

    const params = new URLSearchParams({
      branch: branchSlug,
      subject: subjectSlug,
      summary: "true",
      limit: "100",
      page: "1",
    });
    const request = axiosInstance.get(`/tutorials?${params.toString()}`)
      .then((res) => {
        const data = res.data.data;
        const list = Array.isArray(data) ? data : (data?.tutorials || data?.data || []);
        const tutorials = (Array.isArray(list) ? list : []).map((tutorial: Record<string, unknown>) => normalizeTutorial(tutorial));
        curriculumCache.set(key, { data: tutorials, expiresAt: Date.now() + CACHE_TTL });
        return tutorials;
      })
      .finally(() => curriculumRequests.delete(key));

    curriculumRequests.set(key, request);
    return request;
  },

  prefetchTutorial: async (tutorialSlug: string): Promise<Tutorial> => {
    const cacheKey = `${CACHE_KEY}_slug_${tutorialSlug}`;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          return normalizeTutorial(JSON.parse(cached));
        }
      } catch {}
    }

    const existingRequest = tutorialRequests.get(tutorialSlug);
    if (existingRequest) return existingRequest;

    const request = axiosInstance.get(`/tutorials/${tutorialSlug}?prefetch=true`).then((res) => {
      const raw = res.data.data.tutorial || res.data.data;
      const tutorial = normalizeTutorial(raw);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(tutorial));
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        } catch {}
      }
      return tutorial;
    }).finally(() => tutorialRequests.delete(tutorialSlug));

    tutorialRequests.set(tutorialSlug, request);
    return request;
  },

  getTutorialBySlug: async (_branch: string, _subject: string, _topic: string, tutorialSlug: string): Promise<Tutorial> => {
    const cacheKey = `${CACHE_KEY}_slug_${tutorialSlug}`;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          return normalizeTutorial(JSON.parse(cached));
        }
      } catch {}
    }

    const existingRequest = tutorialRequests.get(tutorialSlug);
    if (existingRequest) return existingRequest;

    const request = axiosInstance.get(`/tutorials/${tutorialSlug}`).then((res) => {
      const t = res.data.data.tutorial || res.data.data;
      const tutorial = normalizeTutorial(t);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(tutorial));
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        } catch {}
      }
      return tutorial;
    }).finally(() => tutorialRequests.delete(tutorialSlug));

    tutorialRequests.set(tutorialSlug, request);
    return request;
  },

  searchTutorials: async (query: string): Promise<Tutorial[]> => {
    const cacheKey = `${CACHE_KEY}_search_${query}`;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          return JSON.parse(cached);
        }
      } catch {}
    }

    const res = await axiosInstance.get(`/tutorials/search?q=${encodeURIComponent(query)}&limit=50`);
    const data = res.data.data.tutorials || res.data.data;
    const list = Array.isArray(data) ? data : [];
    const tutorials = (list as Record<string, unknown>[]).map((t) => ({
      ...(t as unknown as Tutorial),
      id: (t.id || t._id) as string,
    }));

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(tutorials));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      } catch {}
    }

    return tutorials;
  },

  createTutorial: async (data: Partial<Tutorial>): Promise<Tutorial> => {
    const res = await axiosInstance.post("/tutorials", data);
    const t = res.data.data.tutorial || res.data.data;
    if (typeof window !== "undefined") {
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.includes(CACHE_KEY)) localStorage.removeItem(k);
        });
      } catch {}
    }
    return {
      ...(t as unknown as Tutorial),
      id: (t.id || t._id) as string,
    };
  },

  updateTutorial: async (id: string, data: Partial<Tutorial>): Promise<Tutorial> => {
    const res = await axiosInstance.put(`/tutorials/${id}`, data);
    const t = res.data.data.tutorial || res.data.data;
    if (typeof window !== "undefined") {
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.includes(CACHE_KEY)) localStorage.removeItem(k);
        });
      } catch {}
    }
    return {
      ...(t as unknown as Tutorial),
      id: (t.id || t._id) as string,
    };
  },

  deleteTutorial: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tutorials/${id}`);
    if (typeof window !== "undefined") {
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.includes(CACHE_KEY)) localStorage.removeItem(key);
        });
      } catch {}
    }
  },

  reorderTutorials: async (tutorialIds: string[]): Promise<Tutorial[] | null> => {
    const res = await axiosInstance.post("/tutorials/reorder", { tutorialIds });
    const persistedTutorials = res.data.data?.tutorials;
    if (typeof window !== "undefined") {
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.includes(CACHE_KEY)) localStorage.removeItem(k);
        });
      } catch {}
    }
    return Array.isArray(persistedTutorials) ? persistedTutorials : null;
  },
};
