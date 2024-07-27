import { Button } from "@mantine/core";

export default function CustomButton({
  title = "Create",
  icon,
  handleClick,
  ...props
}) {
  return (
    <Button
      {...props}
      radius="xl"
      color="#237558"
      onClick={handleClick}
      rightSection={icon}
    >
      {title}
    </Button>
  );
}
