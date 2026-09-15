"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import RouteProgressBar from "@/components/RouteProgressBar";

const STORAGE_KEY = "scara_sidebar_collapsed";
const SIDEBAR_FULL = "240px";
const SIDEBAR_RAIL = "64px";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    function sync() {
      const stored = localStorage.getItem(STORAGE_KEY);
      setCollapsed(stored === "true");
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const sidebarWidth = collapsed ? SIDEBAR_RAIL : SIDEBAR_FULL;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-base)",
      }}
    >
      <RouteProgressBar />
      <Sidebar />

      <div
        style={{
          flex: 1,
          marginLeft: sidebarWidth,
          transition: "margin-left 180ms cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          willChange: "margin-left",
        }}
      >
        <Topbar sidebarWidth={sidebarWidth} />

        <main
          style={{
            flex: 1,
            marginTop: "56px",
            padding: "32px",
            maxWidth: "1280px",
            width: "100%",
            alignSelf: "center",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
