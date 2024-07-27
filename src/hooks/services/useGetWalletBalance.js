import { useQuery } from "@tanstack/react-query";

//local imports
import { getWalletBalance } from "@/services/balance";

const useGetWalletBalance = (id) => {
  const callback = async () => {
    const res = await getWalletBalance(id);

    return res.data.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getWalletBalance", id],
    queryFn: callback,
    enabled: () => !!id,
  });

  return {
    data,
    isError,
    isLoading,
  };
};

export default useGetWalletBalance;
