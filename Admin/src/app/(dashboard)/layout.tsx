"use client";

import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import RouteProgressBar from "@/components/RouteProgressBar";

const SIDEBAR_WIDTH = "240px";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          marginLeft: SIDEBAR_WIDTH,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar sidebarWidth={SIDEBAR_WIDTH} />

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
