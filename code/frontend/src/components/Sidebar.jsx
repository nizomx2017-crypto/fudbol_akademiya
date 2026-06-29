import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Layers, CreditCard, DoorOpen, Settings, Sparkles
} from "lucide-react";
import { useAuth } from "../auth/useauth.js";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, access: "dashboard:view" },
  { to: "/students", label: "Students", icon: Users, access: "students:view" },
  { to: "/teachers", label: "Teachers", icon: GraduationCap, access: "teachers:view" },
  { to: "/courses", label: "Courses", icon: BookOpen, access: "courses:view" },
  { to: "/groups", label: "Groups", icon: Layers, access: "groups:view" },
  { to: "/payments", label: "Payments", icon: CreditCard, access: "payments:view" },
  { to: "/rooms", label: "Rooms", icon: DoorOpen, access: "rooms:view" },
  { to: "/settings", label: "Settings", icon: Settings, access: "settings:view" },
];

export default function Sidebar({ open, onClose }) {
  const { hasAccess } = useAuth();
  const visibleItems = items.filter((item) => hasAccess(item.access));

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="brand-logo">E</div>
        <div>
          <div className="brand-name">EduCenter</div>
          <div className="brand-sub">Admin Panel</div>
        </div>
      </div>

      <div className="nav-label">Workspace</div>
      {visibleItems.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.to === "/"}
          onClick={onClose}
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <it.icon />
          <span>{it.label}</span>
        </NavLink>
      ))}

      <div className="sidebar-foot">
        <h4><Sparkles size={14} style={{ display: "inline", marginRight: 6, color: "var(--emerald-2)" }} />Upgrade Pro</h4>
        <p>Unlock analytics, exports and SMS notifications for your center.</p>
        <button>Get Pro</button>
      </div>
    </aside>
  );
}
