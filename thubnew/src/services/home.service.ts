import { axiosInstance } from '@/lib/axios';
import { API_BASE_URL } from '@/lib/constants';
import { Branch, Subject, Tutorial } from '@/types';

export interface HomeData {
  branches: Branch[];
  courses: Subject[];
  tutorials: Tutorial[];
}

const HOME_CACHE_TTL = 60 * 1000;
let homeCache: { data: HomeData; expiresAt: number } | null = null;

let homeRequest: Promise<HomeData> | null = null;

const normalizeImageUrl = (image?: string) => {
  if (!image || !image.startsWith('/')) return image;
  return `${new URL(API_BASE_URL).origin}${image}`;
};

export const homeService = {
  getHome: (): Promise<HomeData> => {
    if (homeCache && homeCache.expiresAt > Date.now()) return Promise.resolve(homeCache.data);
    if (homeRequest) return homeRequest;

    homeRequest = axiosInstance.get('/home')
      .then((res) => {
        const data = res.data.data as HomeData;
        return {
          branches: (data.branches || []).map((branch) => ({
            ...branch,
            id: branch.id || (branch as Branch & { _id?: string })._id || '',
            image: normalizeImageUrl(branch.image)
          })),
          courses: (data.courses || []).map((course) => ({
            ...course,
            id: course.id || (course as Subject & { _id?: string })._id || ''
          })),
          tutorials: (data.tutorials || []).map((tutorial) => ({
            ...tutorial,
            id: tutorial.id || (tutorial as Tutorial & { _id?: string })._id || ''
          }))
        };
      })
      .then((data) => {
        homeCache = { data, expiresAt: Date.now() + HOME_CACHE_TTL };
        return data;
      })
      .finally(() => {
        homeRequest = null;
      });

    return homeRequest;
  }
};
