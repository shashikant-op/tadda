import { axiosInstance } from "@/lib/axios";
import { User } from "@/types";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginDTO): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data.data;
  },

  register: async (data: RegisterDTO): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get("/auth/me");
    return response.data.data.user;
  },
};
