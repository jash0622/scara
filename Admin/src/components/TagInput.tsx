"use client";

import { useState, KeyboardEvent, useRef } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter…",
  label,
  error,
  disabled,
}: TagInputProps) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setInputVal("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && !inputVal && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          alignItems: "center",
          backgroundColor: "var(--bg-input)",
          border: `1px solid ${error ? "var(--status-danger)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-sm)",
          padding: "7px 10px",
          minHeight: "40px",
          cursor: "text",
          transition: "border-color 120ms ease-out, box-shadow 120ms ease-out",
        }}
        onFocus={() => {
          const el = inputRef.current?.parentElement;
          if (el) {
            el.style.borderColor = "var(--accent)";
            el.style.boxShadow = "0 0 0 3px var(--accent-subtle-border)";
          }
        }}
        onBlur={() => {
          const el = inputRef.current?.parentElement;
          if (el) {
            el.style.borderColor = error ? "var(--status-danger)" : "var(--border-default)";
            el.style.boxShadow = "none";
          }
        }}
      >
        {/* Existing tags */}
        {value.map((tag) => (
          <span
            key={tag}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 8px 2px 10px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--bg-surface-raised)",
              border: "1px solid var(--border-default)",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text-primary)",
              lineHeight: "18px",
              flexShrink: 0,
            }}
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  lineHeight: 1,
                }}
                aria-label={`Remove ${tag}`}
              >
                <X size={11} />
              </button>
            )}
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => { if (inputVal.trim()) addTag(inputVal); }}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          style={{
            flex: 1,
            minWidth: "120px",
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "13px",
            padding: "1px 2px",
          }}
        />
      </div>
      {error && (
        <p className="form-error">
          <span style={{ fontSize: "11px" }}>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
