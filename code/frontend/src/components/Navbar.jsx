import { useMemo, useRef, useState } from "react";
import { Bell, LogOut, Menu, Search, ShieldCheck, Sun, UserRound } from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { AUTH_TOKEN_STORAGE_KEY } from "../services/api.js";

export default function Navbar({ onMenu }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { hasFullAccess, signOut, user } = useAuth();
  const tokenInfo = useMemo(getTokenInfo, [user]);
  const accessCount = hasFullAccess ? "Full" : user?.accesses?.length || 0;

  return (
    <header className="navbar">
      <div className="nav-left">
        <button className="icon-btn menu-toggle" onClick={onMenu} aria-label="Menu">
          <Menu size={18} />
        </button>
        <div className="nav-search">
          <Search size={16} />
          <input placeholder="Search students, courses, payments..." />
        </div>
      </div>
      <div className="nav-right">
        <button className="icon-btn"><Sun size={18} /></button>
        <button className="icon-btn"><Bell size={18} /></button>
        <div className="user-menu" ref={menuRef}>
          <button
            className="avatar"
            type="button"
            aria-label="User menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {getInitials(user?.login)}
          </button>

          {open ? (
            <div className="user-dropdown">
              <div className="user-drop-head">
                <div className="avatar user-drop-avatar">{getInitials(user?.login)}</div>
                <div>
                  <div className="user-drop-name">{user?.login || "Unknown user"}</div>
                  <div className="user-drop-muted">{user?.status || "unknown"}</div>
                </div>
              </div>

              <div className="user-drop-row">
                <span>Role</span>
                <strong className="role-badge"><ShieldCheck size={13} /> {user?.role || "ROLE"}</strong>
              </div>
              <div className="user-drop-row">
                <span>Status</span>
                <strong className={`token-pill ${user?.status === "active" ? "active" : "expired"}`}>
                  {user?.status || "unknown"}
                </strong>
              </div>
              <div className="user-drop-row">
                <span>Accesslar</span>
                <strong>{accessCount}</strong>
              </div>
              <div className="user-drop-row">
                <span>JWT token</span>
                <strong className={`token-pill ${tokenInfo.active ? "active" : "expired"}`}>
                  {tokenInfo.active ? "Active" : "Expired"}
                </strong>
              </div>

              <div className="user-drop-actions">
                <button className="btn btn-ghost compact-btn" type="button" onClick={() => setOpen(false)}>
                  <UserRound /> Profil
                </button>
                <button className="btn btn-danger compact-btn" type="button" onClick={signOut}>
                  <LogOut /> Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function getInitials(login = "") {
  return login
    .split(/[._\s-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";
}

function getTokenInfo() {
  const token = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (!token) {
    return { active: false };
  }

  try {
    const [, payload] = token.split(".");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const parsed = JSON.parse(atob(normalized));

    return {
      active: parsed.exp ? parsed.exp * 1000 > Date.now() : true,
    };
  } catch {
    return { active: false };
  }
}
