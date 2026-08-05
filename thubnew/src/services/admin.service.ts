import { axiosInstance } from "@/lib/axios";

export const adminService = {
  getAnalytics: async () => {
    const res = await axiosInstance.get("/admin/analytics");
    return res.data.data.analytics || res.data.data;
  },
  getUsers: async () => {
    const res = await axiosInstance.get("/admin/users");
    return res.data.data.users || res.data.data;
  },
  updateUserRole: async (userId: string, role: string) => {
    const res = await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
    return res.data.data.user || res.data.data;
  },
};
