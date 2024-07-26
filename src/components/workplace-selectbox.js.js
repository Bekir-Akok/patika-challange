import { Select } from "@mantine/core";

export default function WorkplaceSelectbox({ data, setState }) {
  return (
    <Select
      maw={200}
      label="Pick your workplace"
      placeholder="Pick value"
      onChange={(e) => setState(e)}
      data={data}
    />
  );
}
