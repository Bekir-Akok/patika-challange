import axiosInstance from "@/utils/axios";

const prefix = "/transfer";

export const sendTransfer = async (values) => {
  const { amount, transferAddress, myAddress } = values;

  const body = {
    amount: String(amount),
    myAddress: myAddress.walletId,
    transferAddress,
  };

  return await axiosInstance.post(`${prefix}`, body, {
    handleNotification: true,
  });
};
