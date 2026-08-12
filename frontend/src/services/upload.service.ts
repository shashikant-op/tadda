import { axiosInstance } from "@/lib/axios";

export const uploadService = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axiosInstance.post("/tutorials/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};
