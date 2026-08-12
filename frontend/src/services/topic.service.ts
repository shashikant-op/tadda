import { axiosInstance } from "@/lib/axios";
import { Topic } from "@/types";

export const topicService = {
  getTopics: async (subjectId?: string): Promise<Topic[]> => {
    const url = subjectId ? `/topics?subject=${subjectId}` : "/topics";
    const res = await axiosInstance.get(url);
    const data = res.data.data.topics || res.data.data;
    console.log("🔖 Topics", data, `Total Topics: ${data.length}`);
    return data;
  },
  getTopicBySlug: async (slug: string): Promise<Topic> => {
    const res = await axiosInstance.get(`/topics/${slug}`);
    return res.data.data.topic || res.data.data;
  },
};
