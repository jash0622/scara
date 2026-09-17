"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Breadcrumb label map
const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "case-studies": "Case Studies",
  insights: "Insights",
  enquiries: "Enquiries",
  activity: "Activity",
  account: "Account",
  new: "New",
};

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = LABELS[seg] ?? seg;
    const isLast = i === segments.length - 1;
    // UUID segment — show as "Edit"
    const isId = /^[0-9a-f-]{36}$/i.test(seg);
    return { href, label: isId ? "Edit" : label, isLast };
  });
}

interface TopbarProps {
  sidebarWidth: string;
}

export function Topbar({ sidebarWidth }: TopbarProps) {
  const pathname = usePathname();
  const crumbs = buildBreadcrumbs(pathname);

  // Page title = last crumb
  const pageTitle = crumbs[crumbs.length - 1]?.label ?? "Dashboard";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: sidebarWidth,
        right: 0,
        height: "56px",
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        transition: "left 200ms ease-out",
      }}
    >
      {/* Left: title + breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {crumbs.length > 1 ? (
          <nav
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
            aria-label="Breadcrumb"
          >
            {crumbs.map((crumb, i) => (
              <span
                key={crumb.href}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {i > 0 && (
                  <ChevronRight
                    size={13}
                    style={{ color: "var(--text-muted)", flexShrink: 0 }}
                  />
                )}
                {crumb.isLast ? (
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      transition: "color 120ms ease-out",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--text-primary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--text-secondary)")
                    }
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            {pageTitle}
          </h1>
        )}
      </div>

      {/* Right: placeholder for future cmdk / account menu */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <kbd
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "3px 7px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-default)",
            backgroundColor: "var(--bg-surface-raised)",
            fontSize: "11px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-geist-mono)",
            cursor: "pointer",
            userSelect: "none",
          }}
          title="Command palette (coming soon)"
        >
          ⌘K
        </kbd>
      </div>
    </header>
  );
}
