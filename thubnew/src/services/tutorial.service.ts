import { axiosInstance } from "@/lib/axios";
import { Tutorial, Branch } from "@/types";

const CACHE_KEY = "thub_tutorials_cache_v3";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

  getTutorialBySlug: async (_branch: string, _subject: string, _topic: string, tutorialSlug: string): Promise<Tutorial> => {
    const cacheKey = `${CACHE_KEY}_slug_${tutorialSlug}`;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          return JSON.parse(cached);
        }
      } catch {}
    }

    const res = await axiosInstance.get(`/tutorials/${tutorialSlug}`);
    const t = res.data.data.tutorial || res.data.data;
    const tutorial = {
      ...(t as unknown as Tutorial),
      id: (t.id || t._id) as string,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(tutorial));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      } catch {}
    }

    return tutorial;
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
