import axiosInstance from "@/utils/axios";

const prefix = "/payment";

export const getPayments = async (id) => {
  return await axiosInstance.get(`${prefix}/${id}`);
};
