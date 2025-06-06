import { ErrorBoundary, ScreenSizeInfo, Toaster } from "@components";
import { sitename } from "@site.config";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { MapNavigationProvider } from "../contexts/MapNavigationContext";
import { WebSocketProvider } from "../contexts/WebSocketContext";
import "../css/index.css";

const Root = (props) => {
  const { Component, pageProps } = props;
  const queryClient = new QueryClient();

  return (
    <>
      <Head>
        <title>{sitename}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover"
        />
      </Head>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <WebSocketProvider>
            <MapNavigationProvider>
              <Component {...pageProps} />
            </MapNavigationProvider>
          </WebSocketProvider>
        </QueryClientProvider>
        <Toaster />
        <ScreenSizeInfo />
      </ErrorBoundary>
    </>
  );
};

export default Root;
