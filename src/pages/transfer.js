import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Card,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import useGetWalletBalance from "@/hooks/services/useGetWalletBalance";
import { useClipboard } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

//local imports
import { sendTransfer } from "@/services/transfer";

const wallets = [
  {
    name: "EURC",
    value: "0xaf9be9022668c2ae3adcc5a29c5d1c758bbc3c68",
    label: "ETH-SEPOLIA",
    walletId: "b8d1c84d-cf72-54bc-aed5-3ee4fba65cce",
  },
  {
    name: "USDC",
    value: "0x6280af88d20fef12182ecf1f4b968222b2f7cb05",
    label: "MATIC-AMOY",
    walletId: "0780caf0-b075-5d6e-962e-68a873856b14",
  },
];

export default function Transfer() {
  const [loading, setLoading] = useState(false);
  const clipboard = useClipboard({ timeout: 500 });

  const form = useForm({
    initialValues: {
      myAddress: null,
      transferAddress: "",
      amount: 0,
    },

    validate: {},
  });

  const { data, isError, isLoading } = useGetWalletBalance(
    form.values.myAddress?.walletId
  );

  const selectedBalance = data?.filter(
    (token) => token.token.name === form.values.myAddress?.name
  )[0];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await sendTransfer(values);
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

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center">
      <Card
        withBorder
        radius="md"
        miw={300}
        mih={300}
        className="my-16 flex flex-col justify-between items-center gap-4"
      >
        <Text c="dimmed" className="text-2xl text-center">
          * Pick your network and transfer
        </Text>
        <form
          className="w-full md:w-1/3"
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <Stack>
            <Select
              required
              label="Your Wallet"
              placeholder="Pick Network"
              data={wallets}
              value={form.values.myAddress?.value}
              onChange={(_value, option) =>
                form.setFieldValue("myAddress", option)
              }
            />
            {form.values.myAddress && (
              <Text
                size="sm"
                className="truncate max-w-full cursor-pointer"
                onClick={() => clipboard.copy(form.values.myAddress?.value)}
              >
                Your Address: {form.values.myAddress?.value}
              </Text>
            )}
            {!!data && !isError && !isLoading && (
              <Text size="sm">
                {selectedBalance.token.name} Balance: {selectedBalance.amount}
              </Text>
            )}
            <TextInput
              required
              label="Transfer Adres"
              value={form.values.transferAddress}
              onChange={(event) =>
                form.setFieldValue("transferAddress", event.currentTarget.value)
              }
              error={form.errors.transferAddress && "Required Field"}
              radius="md"
            />

            <NumberInput
              required
              label="Amount"
              value={form.values.amount}
              onChange={(event) => form.setFieldValue("amount", event)}
              error={form.errors.amount && "Required Field"}
              radius="md"
            />

            <Button
              type="submit"
              className="w-full"
              radius="xl"
              color="#237558"
              loading={loading}
            >
              Transfer
            </Button>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

Transfer.layout = "L1";
