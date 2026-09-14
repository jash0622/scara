"use client";

import { Plus, Trash2 } from "lucide-react";
import { PressOutlet } from "@/lib/types";

interface PressOutletsEditorProps {
  value: PressOutlet[];
  onChange: (outlets: PressOutlet[]) => void;
  error?: string;
  disabled?: boolean;
}

export function PressOutletsEditor({ value, onChange, error, disabled }: PressOutletsEditorProps) {
  function update(i: number, field: keyof PressOutlet, val: string) {
    const next = value.map((o, idx) => (idx === i ? { ...o, [field]: val } : o));
    onChange(next);
  }

  function add() {
    onChange([...value, { name: "", url: "" }]);
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label className="form-label">Press & Media Coverage</label>

      {value.length === 0 && (
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
          No press outlets added yet.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
        {value.map((outlet, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr auto",
              gap: "8px",
              alignItems: "center",
              padding: "12px",
              backgroundColor: "var(--bg-surface-raised)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
            }}
          >
            {/* Outlet name */}
            <input
              type="text"
              value={outlet.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="e.g. IGN India"
              disabled={disabled}
              className="input-base"
              style={{ fontSize: "13px" }}
            />

            {/* URL */}
            <input
              type="url"
              value={outlet.url}
              onChange={(e) => update(i, "url", e.target.value)}
              placeholder="https://…"
              disabled={disabled}
              className="input-base"
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-geist-mono)",
              }}
            />

            {/* Remove */}
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={disabled}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--status-danger)",
                display: "flex",
                alignItems: "center",
                padding: "6px",
                borderRadius: "var(--radius-sm)",
              }}
              aria-label={`Remove ${outlet.name || "outlet"}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        disabled={disabled}
        className="btn btn-ghost"
        style={{ fontSize: "12px", gap: "6px" }}
      >
        <Plus size={13} />
        Add Outlet
      </button>

      {error && <p className="form-error"><span>⚠</span> {error}</p>}
    </div>
  );
}
