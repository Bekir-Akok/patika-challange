import { useState } from "react";
import { ActionIcon, ScrollArea, Table, Text } from "@mantine/core";
import cx from "clsx";

//local imports
import classes from "./table.module.css";
import CustomLoader from "../loader";
import Error from "../error";
import { IconRotateClockwise } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";

export function TableArea({ data, isError, isLoading, workshop, refetch, id }) {
  const [scrolled, setScrolled] = useState(false);

  const rows = data?.map((row) => (
    <Table.Tr key={row._id}>
      <Table.Td>{row?.transferAddress}</Table.Td>
      <Table.Td>{row?.amount}</Table.Td>
      <Table.Td>{row?.restAmount}</Table.Td>
      <Table.Td>{row?.blockchain}</Table.Td>
      <Table.Td>{row?.status}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea
      h={350}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <div className="mb-3 mr-2 flex justify-end">
        <ActionIcon
          disabled={!id}
          onClick={() => {
            refetch()
              .then(() =>
                showNotification({
                  title: "Success",
                  color: "lime",
                  autoClose: 3000,
                })
              )
              .catch(() =>
                showNotification({
                  title: "Failure",
                  color: "red",
                  autoClose: 3000,
                })
              );
          }}
          variant="filled"
          aria-label="Settings"
        >
          <IconRotateClockwise
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </div>

      <Table miw={700}>
        <Table.Thead
          className={cx(classes.header, { [classes.scrolled]: scrolled })}
        >
          <Table.Tr>
            <Table.Th>Transfer Address</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Rest Amount</Table.Th>
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
