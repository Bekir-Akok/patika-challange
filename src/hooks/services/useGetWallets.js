import { useQuery } from "@tanstack/react-query";

//local imports
import { getWallets } from "@/services/workplace";

const useGetWallets = (id) => {
  const callback = async () => {
    const res = await getWallets(id);

    return res.data;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getWallets", id],
    queryFn: callback,
    enabled: () => !!id,
  });

  return {
    data: data?.data,
    title: `${data?.name} Wallets`,
    isError,
    isLoading,
    refetch,
  };
};

export default useGetWallets;
