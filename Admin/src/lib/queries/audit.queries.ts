"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "../api-client";
import { PaginatedResult } from "../types";

export interface AuditEntry {
  id: string;
  actor: string;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
}

const QK = {
  all: (page: number, limit: number) => ["audit", page, limit] as const,
};

export function useAuditLog(page = 1, limit = 50) {
  return useQuery({
    queryKey: QK.all(page, limit),
    queryFn: async () => {
      const res = await api.get<PaginatedResult<AuditEntry>>("/api/audit", { page, limit });
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}
