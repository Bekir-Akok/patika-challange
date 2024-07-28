import { useEffect, useState } from "react";
import { Card, JsonInput, Text } from "@mantine/core";
//local imports
import useGetWorkplace from "@/hooks/services/useGetWorkplace";
import WorkplaceSelectbox from "@/components/workplace-selectbox.js";

export default function Lab() {
  const [result, setResult] = useState(null);
  const [selectedWorkPlace, setSelectedWorkplace] = useState();

  const { data } = useGetWorkplace();

  const workplaces = data?.map((workplace) => {
    return workplace.name;
  });

  const workshopId = data?.filter((workplace) => {
    return workplace.name === selectedWorkPlace;
  });

  useEffect(() => {
    const handleMessage = (event) => {
      const res = event.data;
      !!res?.result && setResult(res?.result);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="w-full h-full p-8 flex flex-col">
      <div className="flex justify-end">
        <WorkplaceSelectbox data={workplaces} setState={setSelectedWorkplace} />
      </div>

      <Card
        withBorder
        radius="md"
        miw={300}
        mih={550}
        className="my-8 flex flex-col justify-between"
      >
        <Text c="dimmed" className="text-2xl text-center">
          * In this laboratory, you will see how the payment tool created for
          the workplace you choose works integratedly.
        </Text>

        {workshopId?.length === 1 ? (
          <iframe
            className="w-full h-full mt-4"
            src={`${process.env.NEXT_PUBLIC_MAIN_URL}/payment?workshopId=${workshopId[0]?._id}&amount=1`}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <Text className="!text-[150px] animate-pulseAndScale">☝️</Text>
            <Text className="!text-2xl">Choose a workplace</Text>
          </div>
        )}

        {result && (
          <div className="w-full">
            <JsonInput
              disabled
              className="mt-10"
              defaultValue={JSON.stringify(result)}
              label="Message response:"
            />
          </div>
        )}
      </Card>
    </div>
  );
}

Lab.layout = "L1";
