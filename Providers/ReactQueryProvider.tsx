"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
