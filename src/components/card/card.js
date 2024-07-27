import { useState } from "react";
import {
  Card,
  Text,
  SimpleGrid,
  UnstyledButton,
  Group,
  useMantineTheme,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconLibraryPlus, IconBuildingStore } from "@tabler/icons-react";

//local import
import classes from "./card.module.css";
import { createWorkplaceService } from "@/services/workplace";
import { useRouter } from "next/router";
import { colors } from "@/utils/constant";
import CustomLoader from "../loader";
import EmptyData from "../empty-data";
import Error from "../error";
import CustomButton from "../Button";

export default function CustomCard({ data, isLoading, isError, refetch }) {
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
    },

    validate: {
      name: (val) =>
        val.length < 3 ? "Name should include at least 3 characters" : null,
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createWorkplaceService(values);
      refetch();
      close();
      form.reset();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const items = data?.map((item, i) => (
    <UnstyledButton
      key={item._id}
      className={classes.item}
      onClick={() => router.push(`/${item._id}`)}
    >
      <IconBuildingStore
        color={theme.colors[colors[i % colors.length]][6]}
        size="2rem"
      />
      <Text size="xs" mt={7}>
        {item.name}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card
      withBorder
      radius="md"
      miw={300}
      mih={300}
      className={`${classes.card} mx-4 sm:mx-0`}
    >
      <Group justify="space-between">
        <Text className={classes.title}>My Workplaces</Text>
        <CustomButton
          handleClick={open}
          icon={<IconLibraryPlus className="w-5 h-5" />}
        />
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
          text={"Don't you have a store yet?"}
        />
      </div>

      <Modal opened={opened} onClose={close} centered title="New Workplace">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="Workplace Name"
              placeholder="Workplace-01"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              error={form.errors.name && "Invalid name"}
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
