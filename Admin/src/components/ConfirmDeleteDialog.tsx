"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
}: ConfirmDeleteDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => confirmRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Scrim */}
      <div
        onClick={onCancel}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        style={{
          position: "relative",
          backgroundColor: "var(--bg-surface-raised)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px #232326",
          animation: "fade-in 180ms ease-out",
        }}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            padding: "4px",
            borderRadius: "var(--radius-sm)",
          }}
          aria-label="Cancel"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "rgba(248,113,113,0.12)",
            border: "1px solid rgba(248,113,113,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <AlertTriangle size={20} style={{ color: "var(--status-danger)" }} />
        </div>

        <h2
          id="delete-dialog-title"
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: "18px",
            marginBottom: "24px",
          }}
        >
          {description}
        </p>

        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
            style={{
              backgroundColor: "rgba(248,113,113,0.12)",
              borderColor: "var(--status-danger)",
            }}
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
