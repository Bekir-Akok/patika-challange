import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//local imports
import * as Mapper from "@/utils/mapper";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App({ Component, pageProps }) {
  const Layout = Mapper.layoutMapper[Component.layout || "L2"];

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      defaultColorScheme="dark"
    >
      <QueryClientProvider client={queryClient}>
        <Notifications position="top-right" />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </MantineProvider>
  );
}
