import { Container, Group, ActionIcon, rem, Text } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex-1 border-t-[1px]">
      <Container className="flex justify-between items-center  ">
        <Text c="dimmed" className="!text-[10px] !sm:text-sm">
          © {year} Proudly build by{" "}
          <span
            className="text-blue-400 underline cursor-pointer"
            onClick={() =>
              window.open("https://www.linkedin.com/in/bekir-akok/")
            }
          >
            Be-pin
          </span>
          . All rights reserved.
        </Text>
        <Group
          gap={0}
          justify="flex-end"
          wrap="nowrap"
          onClick={() =>
            window.open("https://github.com/Bekir-Akok/patika-challange")
          }
        >
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandGithub
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
