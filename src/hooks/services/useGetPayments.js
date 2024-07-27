import { useQuery } from "@tanstack/react-query";

//local imports
import { getPayments } from "@/services/payment";

const useGetPayments = (id) => {
  const callback = async () => {
    const res = await getPayments(id);

    return res.data.data;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getPayments", id],
    queryFn: callback,
    enabled: () => !!id,

  });

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default useGetPayments;
