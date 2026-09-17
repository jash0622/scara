"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { api } from "../api-client";
import { Enquiry, EnquiryFilters, EnquiryStats, EnquiryStatsFilters, PaginatedResult } from "../types";
import { toast } from "sonner";

const QK = {
  all: (filters: EnquiryFilters) => ["enquiries", filters] as const,
  one: (id: string) => ["enquiries", id] as const,
  unread: ["enquiries-unread"] as const,
  stats: (filters: EnquiryStatsFilters) => ["enquiries-stats", filters] as const,
};

// ── List (server-paginated) ───────────────────────────────────────────────────

export function useEnquiries(filters: EnquiryFilters = {}, options?: { poll?: boolean }) {
  return useQuery({
    queryKey: QK.all(filters),
    queryFn: async () => {
      const res = await api.get<PaginatedResult<Enquiry>>("/api/enquiries", {
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
        status: filters.status,
        budget: filters.budget,
        q: filters.q,
        from: filters.from,
        to: filters.to,
      });
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    placeholderData: keepPreviousData, // keep old data visible while fetching next page
    // Near-realtime: refresh in the background so new submissions appear without
    // a manual reload. Only when the tab is focused (React Query default).
    refetchInterval: options?.poll ? 30_000 : false,
  });
}

// ── Aggregated stats (server-computed) ────────────────────────────────────────

export function useEnquiryStats(filters: EnquiryStatsFilters = {}) {
  return useQuery({
    queryKey: QK.stats(filters),
    queryFn: async () => {
      const res = await api.get<EnquiryStats>("/api/enquiries/stats", {
        from: filters.from,
        to: filters.to,
      });
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}

// ── Unread count (for sidebar badge) ─────────────────────────────────────────

export function useUnreadEnquiryCount() {
  return useQuery({
    queryKey: QK.unread,
    queryFn: async () => {
      const res = await api.get<PaginatedResult<Enquiry>>("/api/enquiries", {
        status: "new",
        limit: 1,
        page: 1,
      });
      if (!res.success) return 0;
      return res.data.total;
    },
    refetchInterval: 60_000, // poll every minute
  });
}

// ── Single ────────────────────────────────────────────────────────────────────

export function useEnquiry(id: string) {
  return useQuery({
    queryKey: QK.one(id),
    queryFn: async () => {
      const res = await api.get<Enquiry>(`/api/enquiries/${id}`);
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    enabled: !!id,
  });
}

// ── Update status (optimistic) ────────────────────────────────────────────────

export function useUpdateEnquiryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "new" | "read" | "archived";
    }) => {
      const res = await api.patch<Enquiry>(`/api/enquiries/${id}/status`, { status });
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: QK.one(id) });
      const prev = qc.getQueryData<Enquiry>(QK.one(id));
      qc.setQueryData<Enquiry>(QK.one(id), (old) =>
        old ? { ...old, status } : old
      );
      return { prev };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      qc.invalidateQueries({ queryKey: QK.unread });
    },
    onError: (err: Error, { id }, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK.one(id), ctx.prev);
      toast.error(`Status update failed: ${err.message}`);
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────

export function useDeleteEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/enquiries/${id}`);
      if (!res.success) throw new Error(res.error.message);
      return id;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      qc.removeQueries({ queryKey: QK.one(id) });
      toast.success("Enquiry deleted");
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete: ${err.message}`);
    },
  });
}

// ── Bulk status update ────────────────────────────────────────────────────────

export function useBulkUpdateEnquiryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ids,
      status,
    }: {
      ids: string[];
      status: "new" | "read" | "archived";
    }) => {
      const res = await api.patch<{ updated: number; status: string }>(
        "/api/enquiries/bulk-status",
        { ids, status }
      );
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: ({ updated, status }) => {
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      qc.invalidateQueries({ queryKey: QK.unread });
      qc.invalidateQueries({ queryKey: ["enquiries-stats"] });
      toast.success(`${updated} enquir${updated === 1 ? "y" : "ies"} marked ${status}`);
    },
    onError: (err: Error) => {
      toast.error(`Bulk update failed: ${err.message}`);
    },
  });
}

// ── Reply to an enquiry via email ─────────────────────────────────────────────

export function useReplyToEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      subject,
      message,
    }: {
      id: string;
      subject: string;
      message: string;
    }) => {
      const res = await api.post<{ sent: boolean; to: string }>(
        `/api/enquiries/${id}/reply`,
        { subject, message }
      );
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: (data, { id }) => {
      // Reply auto-marks new enquiries as read on the backend.
      qc.invalidateQueries({ queryKey: QK.one(id) });
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      qc.invalidateQueries({ queryKey: QK.unread });
      toast.success(`Reply sent to ${data.to}`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to send reply: ${err.message}`);
    },
  });
}
