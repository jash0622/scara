"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api-client";
import { toast } from "sonner";

export interface Me {
  username: string;
  role: "admin" | "editor";
}

const QK = {
  me: ["me"] as const,
};

// ── Current admin (identity + role) ───────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: QK.me,
    queryFn: async () => {
      const res = await api.get<Me>("/api/auth/me");
      if (!res.success) throw new Error(res.error.message);
      // Older tokens may omit role — default to admin so access isn't lost.
      return { username: res.data.username, role: res.data.role ?? "admin" } as Me;
    },
    staleTime: 5 * 60_000,
  });
}

// ── Change password ───────────────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const res = await api.patch<{ updated: boolean }>("/api/auth/password", { currentPassword, newPassword });
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: () => toast.success("Password updated"),
    onError: (err: Error) => toast.error(err.message),
  });
}

// ── Change username (re-issues token via the Next.js proxy) ───────────────────

export function useChangeUsername() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ password, newUsername }: { password: string; newUsername: string }) => {
      // Proxy sets the refreshed auth cookies, since the token changes.
      const res = await fetch("/api/account/username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, newUsername }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message ?? "Failed to change username");
      }
      return data.data as { admin: { username: string; role: string } };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.me });
      toast.success("Username updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
