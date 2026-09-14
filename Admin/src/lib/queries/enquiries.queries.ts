"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { api } from "../api-client";
import { Enquiry, EnquiryFilters, PaginatedResult } from "../types";
import { toast } from "sonner";

const QK = {
  all: (filters: EnquiryFilters) => ["enquiries", filters] as const,
  one: (id: string) => ["enquiries", id] as const,
  unread: ["enquiries-unread"] as const,
};

// ── List (server-paginated) ───────────────────────────────────────────────────

export function useEnquiries(filters: EnquiryFilters = {}) {
  return useQuery({
    queryKey: QK.all(filters),
    queryFn: async () => {
      const res = await api.get<PaginatedResult<Enquiry>>("/api/enquiries", {
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
        status: filters.status,
        budget: filters.budget,
        from: filters.from,
        to: filters.to,
      });
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    placeholderData: keepPreviousData, // keep old data visible while fetching next page
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
