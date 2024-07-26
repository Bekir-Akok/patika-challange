import { useRouter } from "next/router";
//local imports
import DetailCard from "@/components/card/detail-card";
import useGetWallets from "@/hooks/services/useGetWallets";

export default function WorkplaceDetail() {
  const {
    query: { id },
  } = useRouter();

  const response = useGetWallets(id);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <DetailCard {...response} id={id} back />
    </div>
  );
}

WorkplaceDetail.layout = "L1";
