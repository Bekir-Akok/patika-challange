import { useState } from "react";
import { ScrollArea, Table } from "@mantine/core";
import cx from "clsx";

//local imports
import classes from "./table.module.css";
import CustomLoader from "../loader";
import Error from "../error";
import EmptyData from "../empty-data";

export function TableArea({ data, isError, isLoading }) {
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
        <EmptyData
          length={!(data?.length > 0)}
          isLoading={isLoading}
          isError={isError}
          text={"You can use the Lab for create a payment"}
        />
      </div>
    </ScrollArea>
  );
}
