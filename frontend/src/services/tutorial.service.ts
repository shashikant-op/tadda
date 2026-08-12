import { axiosInstance } from "@/lib/axios";
import { Tutorial, Branch } from "@/types";

export const tutorialService = {
  getBranches: async (): Promise<Branch[]> => {
    const res = await axiosInstance.get("/branches");
    const data = res.data.data.branches || res.data.data;
    const list = Array.isArray(data) ? data : [];
    return list.map((b: Record<string, unknown>) => ({
      ...(b as unknown as Branch),
      id: (b.id || b._id) as string,
    }));
  },

  getTutorials: async (branchId?: string, subjectSlug?: string): Promise<Tutorial[]> => {
    let url = "/tutorials?limit=1000";
    if (branchId) url += `&branch=${branchId}`;
    if (subjectSlug) url += `&subject=${subjectSlug}`;
    const res = await axiosInstance.get(url);
    const responseData = res.data.data;
    const list = Array.isArray(responseData)
      ? responseData
      : (responseData?.tutorials || responseData?.data || []);
    const finalArr = Array.isArray(list) ? list : [];
    return finalArr.map((t: Record<string, unknown>) => ({
      ...(t as unknown as Tutorial),
      id: (t.id || t._id) as string,
    }));
  },

  getTutorialBySlug: async (_branch: string, _subject: string, _topic: string, tutorialSlug: string): Promise<Tutorial> => {
    const res = await axiosInstance.get(`/tutorials/${tutorialSlug}`);
    const t = res.data.data.tutorial || res.data.data;
    return {
      ...(t as unknown as Tutorial),
      id: (t.id || t._id) as string,
    };
  },

  searchTutorials: async (query: string): Promise<Tutorial[]> => {
    const res = await axiosInstance.get(`/tutorials/search?q=${encodeURIComponent(query)}`);
    const data = res.data.data.tutorials || res.data.data;
    const list = Array.isArray(data) ? data : [];
    return (list as Record<string, unknown>[]).map((t) => ({
      ...(t as unknown as Tutorial),
      id: (t.id || t._id) as string,
    }));
  },

  createTutorial: async (data: Partial<Tutorial>): Promise<Tutorial> => {
    const res = await axiosInstance.post("/tutorials", data);
    const t = res.data.data.tutorial || res.data.data;
    return {
      ...(t as unknown as Tutorial),
      id: (t.id || t._id) as string,
    };
  },

  updateTutorial: async (id: string, data: Partial<Tutorial>): Promise<Tutorial> => {
    const res = await axiosInstance.put(`/tutorials/${id}`, data);
    const t = res.data.data.tutorial || res.data.data;
    return {
      ...(t as unknown as Tutorial),
      id: (t.id || t._id) as string,
    };
  },
};
