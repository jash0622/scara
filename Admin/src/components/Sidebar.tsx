"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Newspaper,
  Inbox,
  Activity,
  UserCog,
  LogOut,
} from "lucide-react";
import { useUnreadEnquiryCount } from "@/lib/queries/enquiries.queries";
import { useMe } from "@/lib/queries/auth.queries";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/case-studies", label: "Case Studies", icon: Film },
  { href: "/dashboard/insights", label: "Insights", icon: Newspaper },
  { href: "/dashboard/enquiries", label: "Enquiries", icon: Inbox, badge: true },
  { href: "/dashboard/activity", label: "Activity", icon: Activity, adminOnly: true },
  { href: "/dashboard/account", label: "Account", icon: UserCog },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: unreadCount = 0 } = useUnreadEnquiryCount();
  const { data: me } = useMe();
  const role = me?.role ?? "admin";

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      style={{
        width: "240px",
        minWidth: "240px",
        backgroundColor: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: "0 16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "10px",
          minHeight: "64px",
          flexShrink: 0,
        }}
      >
        <img
          src="/logo-scara.png"
          alt="SCARA"
          style={{ height: "22px", width: "auto", objectFit: "contain" }}
          draggable={false}
        />
      </div>

      {/* ── Nav items ── */}
      <nav
        style={{
          flex: 1,
          padding: "12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {NAV.filter((item) => !item.adminOnly || role === "admin").map(({ href, label, icon: Icon, exact, badge }) => {
          const active = isActive(href, exact);
          const count = badge ? unreadCount : 0;

          return (
            <Link
              key={href}
              href={href}
              className="nav-item"
              data-active={active}
              style={{
                ...(active ? {
                  backgroundColor: "var(--accent-subtle-bg)",
                  color: "var(--text-primary)",
                } : {}),
                justifyContent: "flex-start",
                padding: "8px 12px",
                position: "relative",
                overflow: "hidden",
                transition: "background-color 150ms ease-out",
              }}
            >
              {/* Active indicator bar */}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "6px",
                  bottom: "6px",
                  width: "2px",
                  backgroundColor: "var(--accent)",
                  borderRadius: "0 999px 999px 0",
                  opacity: active ? 1 : 0,
                  transition: "opacity 150ms ease-out",
                }}
              />

              <Icon
                size={16}
                style={{
                  flexShrink: 0,
                  color: active ? "var(--accent)" : "currentColor",
                  transition: "color 150ms ease-out",
                }}
              />

              {/* Label */}
              <span
                style={{
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  maxWidth: "160px",
                  fontSize: "13px",
                }}
              >
                {label}
              </span>

              {/* Badge */}
              {count > 0 && (
                <span
                  style={{
                    position: "relative",
                    padding: "1px 7px",
                    borderRadius: "999px",
                    backgroundColor: "var(--accent-subtle-bg)",
                    border: "1px solid var(--accent-subtle-border)",
                    color: "var(--accent)",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    lineHeight: "16px",
                    flexShrink: 0,
                  }}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "8px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{
            width: "100%",
            justifyContent: "flex-start",
            padding: "8px 12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
          }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: "nowrap", fontSize: "13px", marginLeft: "8px" }}>
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
}
