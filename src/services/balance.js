import axiosInstance from "@/utils/axios";

const prefix = "/balance";

export const getWalletBalance = async (id) => {
  const params = new URLSearchParams();

  params.append("id", id);

  return await axiosInstance.get(`${prefix}`, { params });
};
