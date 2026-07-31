import { axiosInstance } from "@/lib/axios";
import { User, Bookmark, LearningProgress } from "@/types";

export const userService = {
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await axiosInstance.put("/users/profile", data);
    return res.data.data.user || res.data.data;
  },

  getBookmarks: async (): Promise<Bookmark[]> => {
    const res = await axiosInstance.get("/bookmarks");
    return res.data.data.bookmarks || res.data.data;
  },

  getProgress: async (): Promise<LearningProgress[]> => {
    const res = await axiosInstance.get("/progress");
    return res.data.data.progress || res.data.data;
  },
};
