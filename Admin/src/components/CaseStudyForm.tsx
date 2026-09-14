"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Save, X, AlertCircle } from "lucide-react";
import { CaseStudy, CaseStudyFormData } from "@/lib/types";
import { TagInput } from "./TagInput";
import { ParagraphListEditor } from "./ParagraphListEditor";
import { PressOutletsEditor } from "./PressOutletsEditor";
import { SingleImageUploader, MultiImageUploader } from "./ImageUploader";

// ── Zod schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.string().min(1, "Client is required"),
  year: z.coerce.number().int().min(2000).max(2100),
  market: z.string().min(1, "Market is required"),
  category: z.enum(["Gaming", "Sports", "Live", "Culture"]),
  shortDesc: z.string().min(1, "Short description is required").max(300),
  heroImage: z.string().min(1, "Card image is required"),
  bannerImage: z.string().optional().nullable(),
  fullDesc: z.array(z.string().min(1)).min(1, "At least one paragraph is required"),
  services: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  pressOutlets: z.array(z.object({ name: z.string(), url: z.string() })).default([]),
  isFeaturedIP: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = ["Gaming", "Sports", "Live", "Culture"] as const;

interface CaseStudyFormProps {
  defaultValues?: Partial<CaseStudy>;
  onSubmit: (data: CaseStudyFormData) => Promise<void>;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

export function CaseStudyForm({ defaultValues, onSubmit, isSubmitting, mode }: CaseStudyFormProps) {
  const router = useRouter();

  const { control, register, handleSubmit, watch, setValue, formState: { errors, isDirty } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: defaultValues?.title ?? "",
        client: defaultValues?.client ?? "",
        year: defaultValues?.year ?? new Date().getFullYear(),
        market: defaultValues?.market ?? "",
        category: defaultValues?.category ?? "Gaming",
        shortDesc: defaultValues?.shortDesc ?? "",
        heroImage: defaultValues?.heroImage ?? "",
        bannerImage: defaultValues?.bannerImage ?? null,
        fullDesc: defaultValues?.fullDesc?.length ? defaultValues.fullDesc : [""],
        services: defaultValues?.services ?? [],
        gallery: defaultValues?.gallery ?? [],
        pressOutlets: defaultValues?.pressOutlets ?? [],
        isFeaturedIP: defaultValues?.isFeaturedIP ?? false,
      },
    });

  const shortDescValue = watch("shortDesc");
  const category = watch("category");

  async function handleFormSubmit(values: FormValues) {
    await onSubmit(values as CaseStudyFormData);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* ── Section A: Identity ── */}
        <FormSection title="A — Identity">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Title *" error={errors.title?.message}>
              <input {...register("title")} className={`input-base ${errors.title ? "error" : ""}`} placeholder="eFootball Lionel Messi Campaign '26" />
            </Field>
            <Field label="Client *" error={errors.client?.message}>
              <input {...register("client")} className={`input-base ${errors.client ? "error" : ""}`} placeholder="KONAMI" />
            </Field>
            <Field label="Year *" error={errors.year?.message}>
              <input {...register("year")} type="number" className={`input-base ${errors.year ? "error" : ""}`} placeholder="2026" style={{ fontFamily: "var(--font-geist-mono)" }} />
            </Field>
            <Field label="Market *" error={errors.market?.message}>
              <input {...register("market")} className={`input-base ${errors.market ? "error" : ""}`} placeholder="India" />
            </Field>
          </div>

          {/* Category — segmented control */}
          <div>
            <label className="form-label">Category *</label>
            <div style={{ display: "flex", gap: "6px" }}>
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
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured IP toggle */}
          <Controller
            control={control}
            name="isFeaturedIP"
            render={({ field }) => (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: field.value ? "var(--accent)" : "var(--border-default)",
                    position: "relative",
                    transition: "background-color 120ms",
                    flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: "absolute",
                    top: "2px",
                    left: field.value ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "999px",
                    backgroundColor: field.value ? "var(--text-on-accent)" : "var(--bg-surface)",
                    transition: "left 120ms",
                  }} />
                </button>
                <label className="form-label" style={{ margin: 0, cursor: "pointer" }} onClick={() => field.onChange(!field.value)}>
                  Featured / Proprietary IP
                </label>
              </div>
            )}
          />
        </FormSection>

        {/* ── Section B: Descriptions ── */}
        <FormSection title="B — Descriptions">
          <Field
            label={`Short Description * (${shortDescValue?.length ?? 0}/300)`}
            error={errors.shortDesc?.message}
          >
            <textarea
              {...register("shortDesc")}
              className={`input-base ${errors.shortDesc ? "error" : ""}`}
              rows={2}
              placeholder="One-line campaign summary…"
              style={{ resize: "vertical" }}
              maxLength={300}
            />
          </Field>

          <Controller
            control={control}
            name="fullDesc"
            render={({ field }) => (
              <ParagraphListEditor
                label="Campaign Overview *"
                value={field.value}
                onChange={field.onChange}
                error={errors.fullDesc?.message as string | undefined}
              />
            )}
          />
        </FormSection>

        {/* ── Section C: Media ── */}
        <FormSection title="C — Media">

          {/* Card Image */}
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Card Image <span style={{ color: "var(--accent)" }}>*</span>
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "11px", color: "var(--text-muted)" }}>
              Shown on the work grid / card stack. Recommended: 3:4 portrait or 4:3 landscape, focused on a key visual.
            </p>
            <Controller
              control={control}
              name="heroImage"
              render={({ field }) => (
                <SingleImageUploader
                  label=""
                  value={field.value}
                  onChange={field.onChange}
                  folder="case-studies/cards"
                  error={errors.heroImage?.message}
                />
              )}
            />
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--border-subtle)" }} />

          {/* Banner Image */}
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Modal Banner Image <span style={{ color: "var(--text-muted)" }}>(optional)</span>
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "11px", color: "var(--text-muted)" }}>
              Displayed as the large banner inside the case study pop-up. Recommended: 16:9 landscape, wide hero shot. If left empty, the card image will be used as fallback.
            </p>
            <Controller
              control={control}
              name="bannerImage"
              render={({ field }) => (
                <SingleImageUploader
                  label=""
                  value={field.value ?? ""}
                  onChange={(url) => field.onChange(url || null)}
                  folder="case-studies/banners"
                  error={undefined}
                />
              )}
            />
          </div>

          {/* Gallery */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "4px" }}>
            <p style={{ margin: "0 0 4px 0", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Gallery Images
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "11px", color: "var(--text-muted)" }}>
              Additional images shown in the modal carousel below the banner.
            </p>
            <Controller
              control={control}
              name="gallery"
              render={({ field }) => (
                <MultiImageUploader
                  label=""
                  value={field.value}
                  onChange={field.onChange}
                  folder="case-studies/gallery"
                />
              )}
            />
          </div>

        </FormSection>

        {/* ── Section D: Metadata ── */}
        <FormSection title="D — Metadata">
          <Controller
            control={control}
            name="services"
            render={({ field }) => (
              <TagInput
                label="Services Delivered"
                value={field.value}
                onChange={field.onChange}
                placeholder="e.g. Influencer Management…"
              />
            )}
          />
        </FormSection>

        {/* ── Section E: Press ── */}
        <FormSection title="E — Press Coverage">
          <Controller
            control={control}
            name="pressOutlets"
            render={({ field }) => (
              <PressOutletsEditor value={field.value} onChange={field.onChange} />
            )}
          />
        </FormSection>

        {/* ── Sticky save bar ── */}
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
            marginTop: "8px",
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
            onClick={() => router.push("/dashboard/case-studies")}
            disabled={isSubmitting}
          >
            <X size={14} /> Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            <Save size={14} />
            {isSubmitting ? "Saving…" : mode === "create" ? "Create Case Study" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", paddingBottom: "12px", borderBottom: "1px solid var(--border-subtle)" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <p className="form-error"><span>⚠</span> {error}</p>}
    </div>
  );
}
