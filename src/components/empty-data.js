import { Text } from "@mantine/core";

export default function EmptyData({ length, isLoading, isError, text }) {
  return (
    length &&
    !isLoading &&
    !isError && (
      <>
        <Text className="!text-[120px]  animate-pulseAndScale">☝️</Text>
        <Text className="!text-xl">{text}</Text>
      </>
    )
  );
}
