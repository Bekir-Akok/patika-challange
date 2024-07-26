import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Paper,
  Group,
  Button,
  Anchor,
  Stack,
  Divider,
  Text,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { loginService } from "@/services/auth";
import { useState } from "react";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await loginService(values);
      router.push("/");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex justify-center items-center">
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" fw={500} className="text-center">
          CirclePay
        </Text>
        <Divider label=" Welcome to CirclePay" labelPosition="center" my="xl" />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="hello@circle.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => router.push("/auth/register")}
              size="xs"
            >
              {"Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl" color="#237558" loading={loading}>
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}

export default Login;
