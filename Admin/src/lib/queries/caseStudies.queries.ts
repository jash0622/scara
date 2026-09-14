"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../api-client";
import { CaseStudy, CaseStudyFormData } from "../types";
import { toast } from "sonner";

const QK = {
  all: ["case-studies"] as const,
  one: (id: string) => ["case-studies", id] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────

export function useCaseStudies() {
  return useQuery({
    queryKey: QK.all,
    queryFn: async () => {
      const res = await api.get<CaseStudy[]>("/api/case-studies");
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });
}

// ── Single ────────────────────────────────────────────────────────────────────

export function useCaseStudy(id: string) {
  return useQuery({
    queryKey: QK.one(id),
    queryFn: async () => {
      const res = await api.get<CaseStudy>(`/api/case-studies/${id}`);
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    enabled: !!id,
  });
}

// ── Create ────────────────────────────────────────────────────────────────────

export function useCreateCaseStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CaseStudyFormData) => {
      const res = await api.post<CaseStudy>("/api/case-studies", data);
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.all });
      toast.success("Case study created successfully");
    },
    onError: (err: Error) => {
      toast.error(`Failed to create case study: ${err.message}`);
    },
  });
}

// ── Update ────────────────────────────────────────────────────────────────────

export function useUpdateCaseStudy(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CaseStudyFormData>) => {
      const res = await api.put<CaseStudy>(`/api/case-studies/${id}`, data);
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: QK.all });
      qc.setQueryData(QK.one(id), updated);
      toast.success("Case study saved");
    },
    onError: (err: Error) => {
      toast.error(`Failed to save case study: ${err.message}`);
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────

export function useDeleteCaseStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/case-studies/${id}`);
      if (!res.success) throw new Error(res.error.message);
      return id;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: QK.all });
      qc.removeQueries({ queryKey: QK.one(id) });
      toast.success("Case study deleted");
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete: ${err.message}`);
    },
  });
}

// ── Reorder (optimistic) ──────────────────────────────────────────────────────

export function useReorderCaseStudies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: { id: string; display_order: number }[]) => {
      const res = await api.patch("/api/case-studies/reorder", { order });
      if (!res.success) throw new Error((res as { success: false; error: { message: string } }).error.message);
    },
    onMutate: async (order) => {
      await qc.cancelQueries({ queryKey: QK.all });
      const prev = qc.getQueryData<CaseStudy[]>(QK.all);
      // Optimistic: reorder in cache
      qc.setQueryData<CaseStudy[]>(QK.all, (old) => {
        if (!old) return old;
        const orderMap = new Map(order.map((o) => [o.id, o.display_order]));
        return [...old]
          .map((cs) => ({ ...cs, displayOrder: orderMap.get(cs.id) ?? cs.displayOrder }))
          .sort((a, b) => a.displayOrder - b.displayOrder);
      });
      return { prev };
    },
    onError: (err: Error, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK.all, ctx.prev);
      toast.error(`Reorder failed: ${err.message}`);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: QK.all });
    },
  });
}
