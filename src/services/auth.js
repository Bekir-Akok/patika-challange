import axiosInstance from "@/utils/axios";

const prefix = "/auth";

export const loginService = async (values) => {
  return await axiosInstance.post(`${prefix}/login`, values, {
    handleNotification: true,
  });
};

export const registerService = async (values) => {
  return await axiosInstance.post(`${prefix}/register`, values, {
    handleNotification: true,
  });
};

export const logoutService = async () => {
  return await axiosInstance.get(`${prefix}/logout`);
};
