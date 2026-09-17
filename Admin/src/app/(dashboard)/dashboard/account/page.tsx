"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, User, Shield } from "lucide-react";
import { useMe, useChangePassword, useChangeUsername } from "@/lib/queries/auth.queries";

export default function AccountPage() {
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const changePassword = useChangePassword();
  const changeUsername = useChangeUsername();

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);

  // Username form
  const [newUsername, setNewUsername] = useState("");
  const [usernamePassword, setUsernamePassword] = useState("");

  function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  }

  function submitUsername(e: React.FormEvent) {
    e.preventDefault();
    changeUsername.mutate(
      { password: usernamePassword, newUsername: newUsername.trim() },
      {
        onSuccess: () => {
          setUsernamePassword("");
          setNewUsername("");
          router.refresh();
        },
      }
    );
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    padding: "24px",
    marginBottom: "20px",
  };
  const headerStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px",
  };
  const titleStyle: React.CSSProperties = {
    fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0,
  };

  return (
    <div style={{ maxWidth: "560px" }}>
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1 className="page-title">Account</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
            Manage your sign-in credentials.
          </p>
        </div>
      </div>

      {/* Identity */}
      <div style={cardStyle}>
        <div style={headerStyle}>
          <User size={15} style={{ color: "var(--text-muted)" }} />
          <h2 style={titleStyle}>Profile</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 4px" }}>Signed in as</p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
              {isLoading ? "…" : me?.username}
            </p>
          </div>
          {me && (
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                padding: "4px 10px", borderRadius: "var(--radius-full)",
                fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                backgroundColor: "var(--accent-subtle-bg)", border: "1px solid var(--accent-subtle-border)",
                color: "var(--accent)",
              }}
            >
              <Shield size={11} /> {me.role}
            </span>
          )}
        </div>
      </div>

      {/* Change username */}
      <form style={cardStyle} onSubmit={submitUsername}>
        <div style={headerStyle}>
          <User size={15} style={{ color: "var(--text-muted)" }} />
          <h2 style={titleStyle}>Change username</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="form-label" htmlFor="new-username">New username</label>
            <input
              id="new-username" className="input-base" value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={me?.username} autoComplete="username"
              disabled={changeUsername.isPending}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="username-password">Confirm with password</label>
            <input
              id="username-password" type="password" className="input-base" value={usernamePassword}
              onChange={(e) => setUsernamePassword(e.target.value)}
              autoComplete="current-password" disabled={changeUsername.isPending}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit" className="btn btn-primary" style={{ fontSize: "13px" }}
              disabled={changeUsername.isPending || !newUsername.trim() || !usernamePassword}
            >
              {changeUsername.isPending ? "Saving…" : "Update username"}
            </button>
          </div>
        </div>
      </form>

      {/* Change password */}
      <form style={cardStyle} onSubmit={submitPassword}>
        <div style={headerStyle}>
          <KeyRound size={15} style={{ color: "var(--text-muted)" }} />
          <h2 style={titleStyle}>Change password</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {pwError && (
            <div style={{
              fontSize: "13px", color: "var(--status-danger)",
              backgroundColor: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: "var(--radius-md)", padding: "10px 12px",
            }}>
              {pwError}
            </div>
          )}
          <div>
            <label className="form-label" htmlFor="current-password">Current password</label>
            <input
              id="current-password" type="password" className="input-base" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password" disabled={changePassword.isPending}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="new-password">New password</label>
            <input
              id="new-password" type="password" className="input-base" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password" disabled={changePassword.isPending}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password" type="password" className="input-base" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password" disabled={changePassword.isPending}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit" className="btn btn-primary" style={{ fontSize: "13px" }}
              disabled={changePassword.isPending || !currentPassword || !newPassword || !confirmPassword}
            >
              {changePassword.isPending ? "Saving…" : "Update password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
