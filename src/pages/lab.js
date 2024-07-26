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
        mih={300}
        className="flex justify-center items-center my-16"
      >
        <Text c="dimmed" className="text-2xl">
          * In this laboratory, you will see how the payment tool created for
          the workplace you choose works integratedly.
        </Text>

        {workshopId?.length === 1 && (
          <iframe
            className="w-full h-44 mt-10"
            src={`http://localhost:3000/api/payment?workshopId=${workshopId[0]?._id}&amount=50`}
          />
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
