import { useEffect, useState } from "react";
import {
  Card,
  Text,
  SimpleGrid,
  UnstyledButton,
  Group,
  useMantineTheme,
  Modal,
  Stack,
  Select,
  ActionIcon,
  Code,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useClipboard } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconCurrencyDollar,
  IconPlus,
  IconDownload,
} from "@tabler/icons-react";

//local import
import classes from "./card.module.css";
import { createWallet, createWorkplaceService } from "@/services/workplace";
import { useRouter } from "next/router";
import { colors, networks } from "@/utils/constant";
import CustomLoader from "../loader";
import Error from "../error";
import EmptyData from "../empty-data";
import CustomButton from "../Button";
import { showNotification } from "@mantine/notifications";

export default function DetailCard({
  data,
  isLoading,
  isError,
  refetch,
  title,
  back = false,
  id,
}) {
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [frameOpened, { open: frameopen, close: frameclose }] =
    useDisclosure(false);
  const clipboard = useClipboard({ timeout: 500 });
  const theme = useMantineTheme();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      network: "",
    },

    validate: {
      network: (val) => (!val ? true : false),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createWallet(id, values);
      refetch();
      close();
      form.reset();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clipboard.copied) {
      showNotification({
        message: "Copied",
        color: "green",
      });
    }
  }, [clipboard.copied]);

  const items = data?.map((item, i) => (
    <UnstyledButton
      key={item._id}
      className={classes.item}
      style={{ cursor: "default" }}
    >
      <IconCurrencyDollar
        color={theme.colors[colors.reverse()[i % colors.length]][6]}
        size="2rem"
      />
      <Text tt="uppercase" mt={5}>
        {item.blockchain}
      </Text>

      <Text
        c="dimmed"
        size="xs"
        mt={5}
        className="truncate max-w-full cursor-pointer"
        onClick={() => clipboard.copy(item.address)}
      >
        {item.address}
      </Text>

      <Text size="xs" mt={5}>
        {new Date(item.createDate).toLocaleDateString("tr-TR")}
      </Text>
    </UnstyledButton>
  ));

  const code = `
import { useEffect } from "react";

//paste this code into your payment step
function Demo() {

  useEffect(() => {
    const handleMessage = (event) => {
      const res = event.data;
      console.log("response ==>" , res.result)
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return <iframe src="https://patika-challange.vercel.app/api/
  payment?workshopId=${id}
  &amount=YourAmount />;
}`;

  return (
    <Card
      withBorder
      radius="md"
      miw={300}
      mih={300}
      className={`${classes.card} mx-4 sm:mx-0`}
    >
      <Group justify="space-between">
        <Text className={classes.title}>
          {!!back && (
            <IconChevronLeft
              className="h-5 cursor-pointer"
              onClick={() => router.back(-1)}
            />
          )}
          {!isLoading && !isError && title}
        </Text>
        <Group justify="end">
          <ActionIcon
            variant="subtle"
            color="#237558"
            size="xl"
            onClick={frameopen}
          >
            <IconDownload />
          </ActionIcon>
          <ActionIcon variant="subtle" color="#237558" size="xl" onClick={open}>
            <IconPlus />
          </ActionIcon>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 3 }} mt="md">
        {items}
      </SimpleGrid>
      <div className="flex items-center justify-center flex-col ">
        <CustomLoader isLoading={isLoading} isError={isError} />
        <Error isError={isError} data={data} />
        <EmptyData
          length={!(data?.length > 0)}
          isLoading={isLoading}
          isError={isError}
          text={"Create a wallet via Circle"}
        />
      </div>

      <Modal
        opened={frameOpened}
        onClose={frameclose}
        title="Payment integration"
        centered
        transitionProps={{ transition: "fade", duration: 200 }}
        padding={10}
      >
        <Code block className="h-full w-full overflow-auto">
          {code}
        </Code>
      </Modal>

      <Modal opened={opened} onClose={close} centered title="New Wallet">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Select
              required
              label="Select network"
              placeholder="Pick value"
              value={form.values.network}
              data={networks}
              onChange={(event) => form.setFieldValue("network", event)}
              error={form.errors.network && "Required Fields"}
              radius="md"
            />
          </Stack>

          <Group justify="end" mt="xl">
            <CustomButton type="submit" loading={loading} miw={100} />
          </Group>
        </form>
      </Modal>
    </Card>
  );
}
