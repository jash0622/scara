"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
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
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-[380px] rounded-lg border p-8 animate-fade-in"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-default)",
        }}
      >
        {/* Logo mark */}
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center mb-3"
            style={{ gap: "10px" }}
          >
            {/* Angular SCARA mark */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M0 28 L0 8 L8 0 L28 0 L28 8 L8 8 L8 28 Z" fill="#C3ED00" />
              <path d="M12 28 L12 12 L28 12 L28 28 Z" fill="#C3ED00" opacity="0.4" />
            </svg>
            <span
              style={{
                fontWeight: 700,
                fontSize: "18px",
                letterSpacing: "0.12em",
                color: "var(--text-primary)",
                textTransform: "uppercase",
              }}
            >
              SCARA
            </span>
          </div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
            }}
          >
            Admin Panel
          </p>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 600,
            lineHeight: "28px",
            color: "var(--text-primary)",
            marginBottom: "6px",
          }}
        >
          Sign in
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            marginBottom: "28px",
          }}
        >
          Internal access only.
        </p>

        {/* Error banner */}
        {error && (
          <div
            className="flex items-center gap-2 rounded mb-5 px-3 py-2.5"
            style={{
              backgroundColor: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              fontSize: "13px",
              color: "var(--status-danger)",
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="form-label"
            >
              Username
            </label>
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
            <label htmlFor="password" className="form-label">
              Password
            </label>
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
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
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
                  padding: 0,
                }}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            style={{ width: "100%", marginTop: "4px", padding: "10px 16px", fontSize: "14px" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <LoadingSpinner />
                Signing in…
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <LogIn size={15} />
                Sign in
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ animation: "spin 0.7s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="8" strokeLinecap="round" />
    </svg>
  );
}
