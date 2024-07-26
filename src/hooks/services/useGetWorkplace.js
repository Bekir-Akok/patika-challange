import { useQuery } from "@tanstack/react-query";

//local imports
import { getWorkplaceService } from "@/services/workplace";

const useGetWorkplace = () => {
  const callback = async () => {
    const res = await getWorkplaceService();

    return res.data?.data;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getWorkplace"],
    queryFn: callback,
  });

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default useGetWorkplace;
