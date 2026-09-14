"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../api-client";
import { InsightArticle, InsightFormData } from "../types";
import { toast } from "sonner";

const QK = {
  all: ["insights"] as const,
  one: (id: string) => ["insights", id] as const,
};

export function useInsights() {
  return useQuery({
    queryKey: QK.all,
    queryFn: async () => {
      const res = await api.get<InsightArticle[]>("/api/insights");
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });
}

export function useInsight(id: string) {
  return useQuery({
    queryKey: QK.one(id),
    queryFn: async () => {
      const res = await api.get<InsightArticle>(`/api/insights/${id}`);
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateInsight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsightFormData) => {
      const res = await api.post<InsightArticle>("/api/insights", data);
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.all });
      toast.success("Insight article created");
    },
    onError: (err: Error) => {
      toast.error(`Failed to create insight: ${err.message}`);
    },
  });
}

export function useUpdateInsight(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InsightFormData>) => {
      const res = await api.put<InsightArticle>(`/api/insights/${id}`, data);
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: QK.all });
      qc.setQueryData(QK.one(id), updated);
      toast.success("Insight article saved");
    },
    onError: (err: Error) => {
      toast.error(`Failed to save insight: ${err.message}`);
    },
  });
}

export function useDeleteInsight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/insights/${id}`);
      if (!res.success) throw new Error(res.error.message);
      return id;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: QK.all });
      qc.removeQueries({ queryKey: QK.one(id) });
      toast.success("Insight article deleted");
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete: ${err.message}`);
    },
  });
}

export function useReorderInsights() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: { id: string; display_order: number }[]) => {
      const res = await api.patch("/api/insights/reorder", { order });
      if (!res.success) throw new Error((res as { success: false; error: { message: string } }).error.message);
    },
    onMutate: async (order) => {
      await qc.cancelQueries({ queryKey: QK.all });
      const prev = qc.getQueryData<InsightArticle[]>(QK.all);
      qc.setQueryData<InsightArticle[]>(QK.all, (old) => {
        if (!old) return old;
        const orderMap = new Map(order.map((o) => [o.id, o.display_order]));
        return [...old]
          .map((a) => ({ ...a, displayOrder: orderMap.get(a.id) ?? a.displayOrder }))
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
