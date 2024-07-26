import { Loader } from "@mantine/core";

export default function CustomLoader({ isLoading, isError }) {
  return !!isLoading && !isError && <Loader size={50} className="mt-20" />;
}
