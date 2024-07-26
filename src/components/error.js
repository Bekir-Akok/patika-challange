import { Text } from "@mantine/core";

export default function Error({ isError, data }) {
  return (
    !!isError &&
    !data && (
      <>
        <Text className="!text-[120px]">😯</Text>
        <Text className="!text-xl">Opps, went wrong something...</Text>
      </>
    )
  );
}
