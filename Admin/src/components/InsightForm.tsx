"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Save, X, AlertCircle, ExternalLink } from "lucide-react";
import { InsightArticle, InsightFormData } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  outlet: z.string().min(1, "Outlet is required"),
  author: z.string().optional(),
  category: z.enum(["Interview", "Authored Article", "Campaign Coverage"]),
  url: z.string().url("Must be a valid URL starting with https://"),
  publishDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = ["Interview", "Authored Article", "Campaign Coverage"] as const;

interface InsightFormProps {
  defaultValues?: Partial<InsightArticle>;
  onSubmit: (data: InsightFormData) => Promise<void>;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

export function InsightForm({ defaultValues, onSubmit, isSubmitting, mode }: InsightFormProps) {
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: defaultValues?.title ?? "",
        outlet: defaultValues?.outlet ?? "",
        author: defaultValues?.author ?? "",
        category: defaultValues?.category ?? "Interview",
        url: defaultValues?.url ?? "",
        publishDate: defaultValues?.publishDate ?? "",
      },
    });

  const category = watch("category");
  const urlValue = watch("url");

  async function handleFormSubmit(values: FormValues) {
    await onSubmit({
      title: values.title,
      outlet: values.outlet,
      author: values.author || undefined,
      category: values.category,
      url: values.url,
      publishDate: values.publishDate || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >

        {/* Title */}
        <Field label="Article Title *" error={errors.title?.message}>
          <input
            {...register("title")}
            className={`input-base ${errors.title ? "error" : ""}`}
            placeholder="How SCARA is building the next generation of gaming fans…"
          />
        </Field>

        {/* Outlet + Author row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Field label="Outlet / Publication *" error={errors.outlet?.message}>
            <input
              {...register("outlet")}
              className={`input-base ${errors.outlet ? "error" : ""}`}
              placeholder="e.g. CNBC TV18"
            />
          </Field>
          <Field
            label="Author Name"
            hint='Displayed on the website as the attribution label — maps to the "date" field for backward compatibility.'
            error={errors.author?.message}
          >
            <input
              {...register("author")}
              className="input-base"
              placeholder="e.g. Manoj George"
            />
          </Field>
        </div>

        {/* Category — segmented */}
        <div>
          <label className="form-label">Category *</label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setValue("category", cat, { shouldDirty: true })}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: 500,
                  border: `1px solid ${category === cat ? "var(--accent)" : "var(--border-default)"}`,
                  backgroundColor: category === cat ? "var(--accent-subtle-bg)" : "var(--bg-surface-raised)",
                  color: category === cat ? "var(--accent)" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 120ms ease-out",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* URL */}
        <Field label="Article URL *" error={errors.url?.message}>
          <div style={{ position: "relative" }}>
            <input
              {...register("url")}
              type="url"
              className={`input-base ${errors.url ? "error" : ""}`}
              placeholder="https://…"
              style={{
                paddingRight: "40px",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "13px",
              }}
            />
            {urlValue && !errors.url && (
              <a
                href={urlValue}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  display: "flex",
                }}
                title="Open article"
                tabIndex={-1}
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </Field>

        {/* Publish date (optional) */}
        <Field
          label="Publish Date"
          hint="Optional. Stored for future display — not currently shown on the website."
          error={errors.publishDate?.message}
        >
          <input
            {...register("publishDate")}
            type="date"
            className="input-base"
            style={{ fontFamily: "var(--font-geist-mono)", fontSize: "13px", colorScheme: "dark" }}
          />
        </Field>
      </div>

      {/* Sticky save bar */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "var(--bg-base)",
          borderTop: "1px solid var(--border-subtle)",
          padding: "16px 0",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "24px",
          zIndex: 10,
        }}
      >
        {isDirty && (
          <p style={{ fontSize: "12px", color: "var(--text-muted)", alignSelf: "center", marginRight: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
            <AlertCircle size={12} /> Unsaved changes
          </p>
        )}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.push("/dashboard/insights")}
          disabled={isSubmitting}
        >
          <X size={14} /> Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          <Save size={14} />
          {isSubmitting ? "Saving…" : mode === "create" ? "Create Article" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {hint && (
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px", marginTop: "-2px", lineHeight: "16px" }}>
          {hint}
        </p>
      )}
      {children}
      {error && <p className="form-error"><span>⚠</span> {error}</p>}
    </div>
  );
}
