import { axiosInstance } from "@/lib/axios";

export const progressService = {
  getProgress: async () => {
    const res = await axiosInstance.get("/progress");
    return res.data.data.progress || res.data.data;
  },
  markProgressCompleted: async (tutorialId: string) => {
    const res = await axiosInstance.post(`/progress/${tutorialId}`);
    return res.data.data;
  },
};
