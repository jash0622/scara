"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,   // 5 min — don't refetch unless data is stale
            gcTime: 10 * 60 * 1000,      // 10 min — keep in cache
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-surface-raised)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px #232326",
          },
          classNames: {
            success: "toast-success",
            error: "toast-error",
          },
        }}
      />
    </QueryClientProvider>
  );
}
