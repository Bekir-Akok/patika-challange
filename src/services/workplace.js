import axiosInstance from "@/utils/axios";

const prefix = "/workplace";

export const getWorkplaceService = async () => {
  return await axiosInstance.get(`${prefix}`);
};

export const createWorkplaceService = async (values) => {
  return await axiosInstance.post(`${prefix}`, values, {
    handleNotification: true,
  });
};

export const getWallets = async (id) => {
  return await axiosInstance.get(`${prefix}/${id}`);
};

export const createWallet = async (id, values) => {
  return await axiosInstance.post(`${prefix}/${id}`, values, {
    handleNotification: true,
  });
};
