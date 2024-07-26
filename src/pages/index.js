import CustomCard from "@/components/card/card";
import useGetWorkplace from "@/hooks/services/useGetWorkplace";

export default function Home() {
  const response = useGetWorkplace();

  return (
    <div className="w-full h-full flex justify-center items-center">
      <CustomCard {...response} />
    </div>
  );
}

Home.layout = "L1";
