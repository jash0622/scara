"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, AlertCircle, Shield } from "lucide-react";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message ?? "Invalid credentials");
        return;
      }
      router.push(from);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "var(--bg-base)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Left decorative panel ── */}
      <div
        style={{
          display: "none",
          flex: "0 0 45%",
          background: "linear-gradient(135deg, #0D1200 0%, #1A2800 50%, #0A0A0B 100%)",
          borderRight: "1px solid var(--border-subtle)",
          position: "relative",
          overflow: "hidden",
        }}
        className="lg-panel"
      >
        {/* Accent glow */}
        <div style={{
          position: "absolute",
          top: "30%",
          left: "20%",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(195,237,0,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(195,237,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(195,237,0,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }} />
        {/* Content */}
        <div style={{
          position: "relative",
          zIndex: 10,
          padding: "48px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <Image
            src="/logo-scara.png"
            alt="SCARA"
            width={120}
            height={32}
            style={{ objectFit: "contain", objectPosition: "left" }}
          />
          <div>
            <p style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "16px",
            }}>
              INTERNAL TOOLS
            </p>
            <h2 style={{
              fontSize: "36px",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "var(--text-primary)",
              marginBottom: "16px",
            }}>
              Manage your<br />content with<br />confidence.
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Case studies, insights, and enquiries —<br />all in one secure workspace.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Shield size={13} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Secured · Internal access only
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: login form ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}>
        <div style={{ width: "100%", maxWidth: "360px" }}>

          {/* Logo — always visible on mobile, hidden on desktop (left panel shows it) */}
          <div className="logo-mobile" style={{ marginBottom: "40px" }}>
            <Image
              src="/logo-scara.png"
              alt="SCARA"
              width={100}
              height={28}
              style={{ objectFit: "contain", objectPosition: "left" }}
            />
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "6px",
              lineHeight: 1.3,
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Sign in to your admin workspace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "var(--status-danger)",
            }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoFocus
                className="input-base"
                placeholder="scara-admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="input-base"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    padding: "2px",
                    borderRadius: "4px",
                    transition: "color 120ms",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "11px 16px", fontSize: "14px", marginTop: "4px", gap: "8px" }}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{
            marginTop: "32px",
            fontSize: "12px",
            color: "var(--text-muted)",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}>
            <Shield size={12} />
            Internal access only
          </p>
        </div>
      </div>

      {/* Responsive styles */}
      <style jsx>{`
        @media (min-width: 1024px) {
          .lg-panel { display: flex !important; }
          .logo-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoadingSpinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.7s linear infinite", flexShrink: 0 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="8" strokeLinecap="round" />
    </svg>
  );
}
