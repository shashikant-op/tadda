import { axiosInstance } from "@/lib/axios";
import { Topic } from "@/types";

const CACHE_KEY = "thub_topics_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const topicService = {
  getTopics: async (subjectId?: string): Promise<Topic[]> => {
    const cacheKey = `${CACHE_KEY}_${subjectId || "all"}`;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          return JSON.parse(cached);
        }
      } catch {}
    }

    const url = subjectId ? `/topics?subject=${subjectId}` : "/topics";
    const res = await axiosInstance.get(url);
    const data = res.data.data.topics || res.data.data;
    const topics = Array.isArray(data) ? data : [];

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(topics));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      } catch {}
    }

    return topics;
  },

  reorderTopics: async (topicIds: string[]): Promise<Topic[] | null> => {
    const res = await axiosInstance.post("/topics/reorder", { topicIds });
    const persistedTopics = res.data.data?.topics;
    if (typeof window !== "undefined") {
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.includes(CACHE_KEY) || k.includes("thub_tutorials_cache")) localStorage.removeItem(k);
        });
      } catch {}
    }
    return Array.isArray(persistedTopics) ? persistedTopics : null;
  },

  deleteTopic: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/topics/${id}`);
    if (typeof window !== "undefined") {
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.includes(CACHE_KEY) || key.includes("thub_tutorials_cache")) localStorage.removeItem(key);
        });
      } catch {}
    }
  },

  getTopicBySlug: async (slug: string): Promise<Topic> => {
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

    const res = await axiosInstance.get(`/topics/${slug}`);
    const topic = res.data.data.topic || res.data.data;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(topic));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      } catch {}
    }

    return topic;
  },
};
