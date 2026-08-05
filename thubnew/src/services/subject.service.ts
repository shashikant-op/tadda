import { axiosInstance } from "@/lib/axios";
import { Subject } from "@/types";

export const subjectService = {
  getSubjects: async (branchId?: string): Promise<Subject[]> => {
    const url = branchId ? `/subjects?branch=${branchId}` : "/subjects";
    const res = await axiosInstance.get(url);
    const data = res.data.data.subjects || res.data.data;
    const list = Array.isArray(data) ? data : [];
    return list.map((s: Record<string, unknown>) => ({
      ...(s as unknown as Subject),
      id: (s.id || s._id) as string,
    }));
  },
  getSubjectBySlug: async (slug: string): Promise<Subject> => {
    const res = await axiosInstance.get(`/subjects/${slug}`);
    const s = res.data.data.subject || res.data.data;
    return {
      ...(s as unknown as Subject),
      id: (s.id || s._id) as string,
    };
  },
};
