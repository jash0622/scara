"use client";

type Status = "new" | "read" | "archived";

const CONFIG: Record<Status, { label: string; dot: string; text: string; bg: string; border: string }> = {
  new: {
    label: "New",
    dot: "#C3ED00",
    text: "#C3ED00",
    bg: "rgba(195,237,0,0.08)",
    border: "rgba(195,237,0,0.24)",
  },
  read: {
    label: "Read",
    dot: "#6E6E73",
    text: "#A1A1A6",
    bg: "rgba(110,110,115,0.1)",
    border: "rgba(110,110,115,0.2)",
  },
  archived: {
    label: "Archived",
    dot: "#3A3A3F",
    text: "#6E6E73",
    bg: "rgba(58,58,63,0.15)",
    border: "rgba(58,58,63,0.3)",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const c = CONFIG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.03em",
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "999px",
          backgroundColor: c.dot,
          flexShrink: 0,
        }}
      />
      {c.label}
    </span>
  );
}

type Category = "Gaming" | "Sports" | "Live" | "Culture";
const CAT_CONFIG: Record<Category, { text: string; bg: string; border: string }> = {
  Gaming:  { text: "#5B9DF9", bg: "rgba(91,157,249,0.1)",  border: "rgba(91,157,249,0.25)" },
  Sports:  { text: "#34D399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)" },
  Live:    { text: "#FBBF24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)" },
  Culture: { text: "#C084FC", bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.25)"},
};

export function CategoryBadge({ category }: { category: Category }) {
  const c = CAT_CONFIG[category];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.03em",
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        whiteSpace: "nowrap",
      }}
    >
      {category}
    </span>
  );
}

type InsightCategory = "Interview" | "Authored Article" | "Campaign Coverage";
const INSIGHT_CAT: Record<InsightCategory, { text: string; bg: string; border: string }> = {
  "Interview":         { text: "#5B9DF9", bg: "rgba(91,157,249,0.1)",  border: "rgba(91,157,249,0.25)" },
  "Authored Article":  { text: "#34D399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)" },
  "Campaign Coverage": { text: "#FBBF24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)" },
};

export function InsightCategoryBadge({ category }: { category: InsightCategory }) {
  const c = INSIGHT_CAT[category];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 500,
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        whiteSpace: "nowrap",
      }}
    >
      {category}
    </span>
  );
}
