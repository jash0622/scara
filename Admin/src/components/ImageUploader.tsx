"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadToS3, deleteS3Object } from "@/lib/api-client";

type UploadFolder = "case-studies" | "case-studies/cards" | "case-studies/banners" | "case-studies/gallery" | "insights" | "general";

interface SingleImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: UploadFolder;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function SingleImageUploader({
  value,
  onChange,
  folder = "case-studies",
  label,
  error,
  disabled,
}: SingleImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      setUploadError(null);
      setUploading(true);
      setProgress(0);
      try {
        const url = await uploadToS3(file, folder, setProgress);
        onChange(url);
      } catch (err) {
        setUploadError((err as Error).message);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: disabled || uploading,
  });

  async function handleRemove() {
    if (value) {
      try { await deleteS3Object(value); } catch { /* best-effort */ }
    }
    onChange("");
  }

  return (
    <div>
      {label && <label className="form-label">{label}</label>}

      {value ? (
        <div
          style={{
            position: "relative",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--border-default)",
            backgroundColor: "var(--bg-surface-raised)",
          }}
        >
          {/* Preview */}
          <img
            src={value}
            alt="Hero image preview"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              display: "block",
            }}
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "rgba(0,0,0,0.7)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                padding: "6px",
              }}
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? "var(--accent)" : error ? "var(--status-danger)" : "var(--border-default)"}`,
            borderRadius: "var(--radius-md)",
            backgroundColor: isDragActive ? "var(--accent-subtle-bg)" : "var(--bg-surface-raised)",
            padding: "32px 16px",
            textAlign: "center",
            cursor: disabled || uploading ? "not-allowed" : "pointer",
            transition: "all 120ms ease-out",
          }}
        >
          <input {...getInputProps()} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            {uploading ? (
              <>
                <Loader2 size={24} style={{ color: "var(--accent)", animation: "spin 0.7s linear infinite" }} />
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Uploading… {progress}%
                </p>
                <div style={{ width: "120px", height: "3px", backgroundColor: "var(--border-default)", borderRadius: "999px" }}>
                  <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "var(--accent)", borderRadius: "999px", transition: "width 100ms" }} />
                </div>
              </>
            ) : (
              <>
                <div style={{ padding: "10px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>
                  <Upload size={20} style={{ color: "var(--text-muted)" }} />
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                  {isDragActive ? "Drop to upload" : "Drag & drop or click to upload"}
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                  JPG, PNG, WebP — max 10MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {uploadError && <p className="form-error"><span>⚠</span> {uploadError}</p>}
      {error && !uploadError && <p className="form-error"><span>⚠</span> {error}</p>}
    </div>
  );
}

// ── Multi-image gallery uploader ──────────────────────────────────────────────

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: UploadFolder;
  label?: string;
  disabled?: boolean;
}

export function MultiImageUploader({
  value,
  onChange,
  folder = "case-studies",
  label,
  disabled,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return;
      setUploadError(null);
      setUploading(true);
      try {
        const uploaded = await Promise.all(
          accepted.map((file) => uploadToS3(file, folder))
        );
        onChange([...value, ...uploaded]);
      } catch (err) {
        setUploadError((err as Error).message);
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled: disabled || uploading,
  });

  async function removeImage(url: string) {
    try { await deleteS3Object(url); } catch { /* best-effort */ }
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      {label && <label className="form-label">{label}</label>}

      {/* Existing images grid */}
      {value.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          {value.map((url) => (
            <div
              key={url}
              style={{
                position: "relative",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
                border: "1px solid var(--border-default)",
                aspectRatio: "16/9",
              }}
            >
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "rgba(0,0,0,0.7)",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    padding: "3px",
                  }}
                >
                  <X size={11} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? "var(--accent)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-md)",
          backgroundColor: isDragActive ? "var(--accent-subtle-bg)" : "var(--bg-surface-raised)",
          padding: "20px",
          textAlign: "center",
          cursor: disabled || uploading ? "not-allowed" : "pointer",
          transition: "all 120ms ease-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2 size={16} style={{ color: "var(--accent)", animation: "spin 0.7s linear infinite" }} />
        ) : (
          <ImageIcon size={16} style={{ color: "var(--text-muted)" }} />
        )}
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          {uploading ? "Uploading…" : isDragActive ? "Drop images here" : "Add gallery images"}
        </span>
      </div>

      {uploadError && <p className="form-error"><span>⚠</span> {uploadError}</p>}
    </div>
  );
}
