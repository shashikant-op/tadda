import { axiosInstance } from "@/lib/axios";

export const bookmarkService = {
  getBookmarks: async () => {
    const res = await axiosInstance.get("/bookmarks");
    return res.data.data.bookmarks || res.data.data;
  },
  addBookmark: async (tutorialId: string) => {
    const res = await axiosInstance.post(`/bookmarks/${tutorialId}`);
    return res.data.data;
  },
  removeBookmark: async (tutorialId: string) => {
    const res = await axiosInstance.delete(`/bookmarks/${tutorialId}`);
    return res.data.data;
  },
};
