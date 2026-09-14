"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";

interface ParagraphListEditorProps {
  value: string[];
  onChange: (paragraphs: string[]) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function ParagraphListEditor({
  value,
  onChange,
  label,
  error,
  disabled,
}: ParagraphListEditorProps) {
  function update(i: number, text: string) {
    const next = [...value];
    next[i] = text;
    onChange(next);
  }

  function add() {
    onChange([...value, ""]);
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      {label && <label className="form-label">{label}</label>}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {value.map((para, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}
          >
            {/* Drag handle (visual only) */}
            <div
              style={{
                paddingTop: "10px",
                color: "var(--text-muted)",
                flexShrink: 0,
                cursor: "grab",
              }}
            >
              <GripVertical size={14} />
            </div>

            {/* Paragraph number */}
            <span
              style={{
                paddingTop: "10px",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text-muted)",
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
                width: "20px",
                textAlign: "right",
              }}
            >
              {i + 1}
            </span>

            <textarea
              value={para}
              onChange={(e) => update(i, e.target.value)}
              disabled={disabled}
              rows={3}
              placeholder={`Paragraph ${i + 1}…`}
              className="input-base"
              style={{ flex: 1, resize: "vertical", minHeight: "72px" }}
            />

            <button
              type="button"
              onClick={() => remove(i)}
              disabled={disabled || value.length <= 1}
              style={{
                paddingTop: "10px",
                background: "none",
                border: "none",
                cursor: value.length <= 1 ? "not-allowed" : "pointer",
                color: value.length <= 1 ? "var(--text-muted)" : "var(--status-danger)",
                opacity: value.length <= 1 ? 0.4 : 1,
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-start",
                padding: "9px 4px 0",
              }}
              aria-label="Remove paragraph"
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
        style={{ marginTop: "10px", fontSize: "12px", gap: "6px" }}
      >
        <Plus size={13} />
        Add Paragraph
      </button>

      {error && <p className="form-error"><span>⚠</span> {error}</p>}
    </div>
  );
}
