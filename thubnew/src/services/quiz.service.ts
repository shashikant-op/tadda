import { axiosInstance } from "@/lib/axios";

export const quizService = {
  getQuiz: async (quizId: string) => {
    const res = await axiosInstance.get(`/quizzes/${quizId}`);
    return res.data.data.quiz || res.data.data;
  },
  submitQuiz: async (quizId: string, answers: unknown) => {
    const res = await axiosInstance.post(`/quizzes/${quizId}/submit`, { answers });
    return res.data.data;
  },
};
