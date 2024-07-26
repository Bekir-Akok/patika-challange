import { Card, Text } from "@mantine/core";

export default function Transfer() {
  return (
    <div className="w-full h-full p-8 flex flex-col">
      <Card
        withBorder
        radius="md"
        miw={300}
        mih={300}
        className="my-16 flex flex-col justify-between items-center gap-4"
      >
        <Text c="dimmed" className="text-2xl text-center">
          * In this section, you can pay 
        </Text>
      </Card>
    </div>
  );
}

Transfer.layout = "L1";
