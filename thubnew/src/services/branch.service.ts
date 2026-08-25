import { axiosInstance } from "@/lib/axios";
import { Branch } from "@/types";

const CACHE_KEY = "thub_branches_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let branchesRequest: Promise<Branch[]> | null = null;

const normalizeBranches = (data: unknown): Branch[] => {
  const list = Array.isArray(data) ? data : [];
  return list.map((branch: Record<string, unknown>) => ({
    ...(branch as unknown as Branch),
    id: (branch.id || branch._id) as string,
  }));
};

export const branchService = {
  getBranches: async (): Promise<Branch[]> => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(`${CACHE_KEY}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          return JSON.parse(cached);
        }
      } catch {}
    }

    if (branchesRequest) return branchesRequest;

    branchesRequest = axiosInstance.get("/branches").then((res) => {
      const data = res.data.data.branches || res.data.data;
      const branches = normalizeBranches(data);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(branches));
          localStorage.setItem(`${CACHE_KEY}_time`, Date.now().toString());
        } catch {}
      }
      return branches;
    }).finally(() => {
      branchesRequest = null;
    });

    return branchesRequest;
  },
  getBranchBySlug: async (slug: string): Promise<Branch> => {
    const cacheKey = `${CACHE_KEY}_slug_${slug}`;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_TTL) {
          return JSON.parse(cached);
        }
      } catch {}
    }

    const res = await axiosInstance.get(`/branches/${slug}`);
    const b = res.data.data.branch || res.data.data;
    const branch = {
      ...(b as unknown as Branch),
      id: (b.id || b._id) as string,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(branch));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      } catch {}
    }

    return branch;
  },
};
