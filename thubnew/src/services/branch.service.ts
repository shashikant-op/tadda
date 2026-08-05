import { axiosInstance } from "@/lib/axios";
import { Branch } from "@/types";

export const branchService = {
  getBranches: async (): Promise<Branch[]> => {
    const res = await axiosInstance.get("/branches");
    const data = res.data.data.branches || res.data.data;
    const list = Array.isArray(data) ? data : [];
    return list.map((b: Record<string, unknown>) => ({
      ...(b as unknown as Branch),
      id: (b.id || b._id) as string,
    }));
  },
  getBranchBySlug: async (slug: string): Promise<Branch> => {
    const res = await axiosInstance.get(`/branches/${slug}`);
    const b = res.data.data.branch || res.data.data;
    return {
      ...(b as unknown as Branch),
      id: (b.id || b._id) as string,
    };
  },
};
