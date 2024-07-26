import { useState } from "react";
import { Card, Text } from "@mantine/core";
//local imports
import useGetWorkplace from "@/hooks/services/useGetWorkplace";
import useGetPayments from "@/hooks/services/useGetPayments";
import WorkplaceSelectbox from "@/components/workplace-selectbox.js";
import { TableArea } from "@/components/table";

export default function Payments() {
  const [selectedWorkPlace, setSelectedWorkplace] = useState();

  const { data } = useGetWorkplace();

  const workplaces = data?.map((workplace) => {
    return workplace.name;
  });

  const workshopId = data?.filter((workplace) => {
    return workplace.name === selectedWorkPlace;
  });

  const id = workshopId?.length === 1 && workshopId[0]?._id;
  const { data: paymentData, isError, isLoading } = useGetPayments(id);

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
        className="my-16 flex flex-col justify-between items-center gap-4"
      >
        <Text c="dimmed" className="text-2xl text-center">
          * In this section, you can track your payments on a project basis
        </Text>

        <TableArea data={paymentData} isError={isError} isLoading={isLoading} />
      </Card>
    </div>
  );
}

Payments.layout = "L1";
