import { axiosInstance } from "@/lib/axios";
import { Tutorial, Branch } from "@/types";

export const tutorialService = {
  getBranches: async (): Promise<Branch[]> => {
    const res = await axiosInstance.get("/branches");
    return res.data.data.branches || res.data.data;
  },

  getTutorialBySlug: async (_branch: string, _subject: string, _topic: string, tutorialSlug: string): Promise<Tutorial> => {
    const res = await axiosInstance.get(`/tutorials/${tutorialSlug}`);
    return res.data.data.tutorial || res.data.data;
  },

  searchTutorials: async (query: string): Promise<Tutorial[]> => {
    const res = await axiosInstance.get(`/tutorials/search?q=${encodeURIComponent(query)}`);
    return res.data.data.tutorials || res.data.data;
  },

  createTutorial: async (data: Partial<Tutorial>): Promise<Tutorial> => {
    const res = await axiosInstance.post("/tutorials", data);
    return res.data.data.tutorial || res.data.data;
  },
};
