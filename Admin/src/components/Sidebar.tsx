"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Newspaper,
  Inbox,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUnreadEnquiryCount } from "@/lib/queries/enquiries.queries";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/case-studies", label: "Case Studies", icon: Film },
  { href: "/dashboard/insights", label: "Insights", icon: Newspaper },
  { href: "/dashboard/enquiries", label: "Enquiries", icon: Inbox, badge: true },
];

const STORAGE_KEY = "scara_sidebar_collapsed";
const TRANSITION = "220ms cubic-bezier(0.4,0,0.2,1)";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [labelVisible, setLabelVisible] = useState(true);
  const { data: unreadCount = 0 } = useUnreadEnquiryCount();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setCollapsed(true);
      setLabelVisible(false);
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem(STORAGE_KEY, String(next));
      // Fade labels out immediately on collapse, fade in slightly delayed on expand
      if (next) {
        setLabelVisible(false);
      } else {
        setTimeout(() => setLabelVisible(true), 120);
      }
      return next;
    });
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  const w = collapsed ? "64px" : "240px";

  return (
    <aside
      style={{
        width: w,
        minWidth: w,
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
        transition: `width ${TRANSITION}`,
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
          justifyContent: collapsed ? "center" : "flex-start",
          gap: "10px",
          minHeight: "64px",
          flexShrink: 0,
          transition: `padding ${TRANSITION}, justify-content ${TRANSITION}`,
        }}
      >
        <ScaraMark />
        <span
          style={{
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "0.1em",
            color: "var(--text-primary)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            opacity: labelVisible ? 1 : 0,
            transform: labelVisible ? "translateX(0)" : "translateX(-6px)",
            transition: `opacity 150ms ease-out, transform 150ms ease-out`,
            pointerEvents: collapsed ? "none" : "auto",
          }}
        >
          SCARA
        </span>
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
        {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
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
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "9px" : "8px 12px",
                position: "relative",
                overflow: "hidden",
                transition: `background-color 150ms ease-out, padding ${TRANSITION}`,
              }}
              title={collapsed ? label : undefined}
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
                  opacity: labelVisible ? 1 : 0,
                  transform: labelVisible ? "translateX(0)" : "translateX(-4px)",
                  transition: "opacity 150ms ease-out, transform 150ms ease-out",
                  overflow: "hidden",
                  maxWidth: collapsed ? "0" : "160px",
                  fontSize: "13px",
                }}
              >
                {label}
              </span>

              {/* Badge — expanded */}
              {count > 0 && (
                <span
                  style={{
                    position: collapsed ? "absolute" : "relative",
                    top: collapsed ? "6px" : "auto",
                    right: collapsed ? "6px" : "auto",
                    width: collapsed ? "7px" : "auto",
                    height: collapsed ? "7px" : "auto",
                    padding: collapsed ? "0" : "1px 7px",
                    borderRadius: "999px",
                    backgroundColor: collapsed ? "var(--accent)" : "var(--accent-subtle-bg)",
                    border: collapsed ? "none" : "1px solid var(--accent-subtle-border)",
                    color: collapsed ? "transparent" : "var(--accent)",
                    fontSize: collapsed ? "0" : "10px",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    lineHeight: "16px",
                    flexShrink: 0,
                    opacity: labelVisible ? 1 : 0,
                    transition: "opacity 150ms ease-out",
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
          onClick={toggleCollapsed}
          className="nav-item"
          style={{
            width: "100%",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "9px" : "8px 12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: `padding ${TRANSITION}`,
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span style={{
            display: "flex",
            alignItems: "center",
            transition: `transform ${TRANSITION}`,
            transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
          }}>
            <ChevronLeft size={16} />
          </span>
          <span
            style={{
              whiteSpace: "nowrap",
              fontSize: "13px",
              marginLeft: "8px",
              opacity: labelVisible ? 1 : 0,
              transition: "opacity 150ms ease-out",
            }}
          >
            Collapse
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="nav-item"
          style={{
            width: "100%",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "9px" : "8px 12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            transition: `padding ${TRANSITION}`,
          }}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          <span
            style={{
              whiteSpace: "nowrap",
              fontSize: "13px",
              marginLeft: "8px",
              opacity: labelVisible ? 1 : 0,
              transition: "opacity 150ms ease-out",
            }}
          >
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
}

function ScaraMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
      <path d="M0 22 L0 6 L6 0 L22 0 L22 6 L6 6 L6 22 Z" fill="#C3ED00" />
      <path d="M9 22 L9 9 L22 9 L22 22 Z" fill="#C3ED00" opacity="0.35" />
    </svg>
  );
}
