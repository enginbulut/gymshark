import _ from "lodash";
import "@styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { ReactElement, ReactNode } from "react";
import Head from "next/head";
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
  QueryCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {},
  }),
  defaultOptions: {
    queries: {
      retry: false,
      useErrorBoundary: (error: unknown) => (error as any).name === "Error",
    },
  },
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ dehydratedQueryClientState?: Object }> & {
  Component: NextPageWithLayout<{ dehydratedQueryClientState?: Object }>;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedQueryClientState}>
        <Head>
          <meta name="viewport" content="viewport-fit=cover" />
        </Head>
        <Toaster />
        {getLayout(<Component {...pageProps} />)}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
