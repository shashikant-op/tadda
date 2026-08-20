import { axiosInstance } from "@/lib/axios";
import { Tutorial, Branch } from "@/types";

const CACHE_KEY = "thub_tutorials_cache";
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

  getTutorials: async (branchId?: string, subjectSlug?: string): Promise<Tutorial[]> => {
    const cacheKey = `${CACHE_KEY}_${branchId || "all"}_${subjectSlug || "all"}`;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {}
    }

    let url = "/tutorials?limit=1000";
    if (branchId) url += `&branch=${branchId}`;
    if (subjectSlug) url += `&subject=${subjectSlug}`;
    const res = await axiosInstance.get(url);
    const responseData = res.data.data;
    const list = Array.isArray(responseData)
      ? responseData
      : (responseData?.tutorials || responseData?.data || []);
    const finalArr = Array.isArray(list) ? list : [];
    const tutorials = finalArr.map((t: Record<string, unknown>) => ({
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

    const res = await axiosInstance.get(`/tutorials/search?q=${encodeURIComponent(query)}`);
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

  reorderTutorials: async (tutorialIds: string[]): Promise<void> => {
    await axiosInstance.post("/tutorials/reorder", { tutorialIds });
    if (typeof window !== "undefined") {
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.includes(CACHE_KEY)) localStorage.removeItem(k);
        });
      } catch {}
    }
  },
};
