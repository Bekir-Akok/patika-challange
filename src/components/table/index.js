import { useState } from "react";
import { ScrollArea, Table, Text } from "@mantine/core";
import cx from "clsx";

//local imports
import classes from "./table.module.css";
import CustomLoader from "../loader";
import Error from "../error";

export function TableArea({ data, isError, isLoading, workshop }) {
  const [scrolled, setScrolled] = useState(false);

  const rows = data?.map((row) => (
    <Table.Tr key={row._id}>
      <Table.Td>{row?.payment?.transferAddress}</Table.Td>
      <Table.Td>{row?.payment?.amount}</Table.Td>
      <Table.Td>{row?.blockchain}</Table.Td>
      <Table.Td>{row?.payment?.status}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea
      h={300}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table miw={700}>
        <Table.Thead
          className={cx(classes.header, { [classes.scrolled]: scrolled })}
        >
          <Table.Tr>
            <Table.Th>Transfer Address</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Network</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <div className="flex items-center justify-center flex-col ">
        <CustomLoader isLoading={isLoading} isError={isError} />
        <Error isError={isError} data={data} />

        {!!workshop ? (
          !(data?.length > 0) &&
          !isLoading &&
          !isError && (
            <>
              <Text className="!text-[120px]  animate-pulseAndScaleLeft">
                ☝️
              </Text>
              <Text className="!text-xl">There is no payment yet</Text>
              <Text c="dimmed" className="!text-sm">
                * You can use the lab for create a payment
              </Text>
            </>
          )
        ) : (
          <>
            <Text className="!text-[120px]  animate-pulseAndScale">☝️</Text>
            <Text className="!text-xl">Choose a workplace</Text>
            <Text c="dimmed" className="!text-sm">
              * If workplace doesnt exist, you can create one using the App
              page.
            </Text>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
