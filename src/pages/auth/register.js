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
  Checkbox,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { registerService } from "@/services/auth";
import { useState } from "react";

function Register(props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
      terms: (val) => (!val ? "Terms must be accepted" : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await registerService(values);
      router.push("/auth/login");
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
        <Divider label=" Register an Account" labelPosition="center" my="xl" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              error={form.errors.email && "Required field"}
              radius="md"
            />

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

            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
              error={form.errors.terms}
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => router.push("/auth/login")}
              size="xs"
            >
              Already have an account? Login
            </Anchor>
            <Button type="submit" radius="xl" color="#237558" loading={loading}>
              Register
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}

export default Register;
