import { Users, GraduationCap, BookOpen, Layers, CreditCard, DoorOpen, TrendingUp, ArrowUpRight } from "lucide-react";
import { mockStudents, mockTeachers, mockCourses, mockGroups, mockPayments, mockRooms } from "../services/mockData.js";

const stats = [
  { label: "Total Students", value: mockStudents.length, trend: "+12%", icon: Users },
  { label: "Total Teachers", value: mockTeachers.length, trend: "+3%", icon: GraduationCap },
  { label: "Total Courses", value: mockCourses.length, trend: "+1", icon: BookOpen },
  { label: "Total Groups", value: mockGroups.length, trend: "+2", icon: Layers },
  { label: "Total Payments", value: mockPayments.reduce((s, p) => s + p.amount, 0).toLocaleString() + " UZS", trend: "+18%", icon: CreditCard },
  { label: "Total Rooms", value: mockRooms.length, trend: "100%", icon: DoorOpen },
];

const quickLinks = [
  { label: "New enrollment", sub: "Register a new student", icon: Users },
  { label: "Schedule class", sub: "Plan today's lessons", icon: Layers },
  { label: "Record payment", sub: "Log a fresh payment", icon: CreditCard },
];

export default function Dashboard() {
  const recent = mockStudents.slice(0, 6);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, Admin</h1>
          <p className="page-sub">Here is what's happening at your education center today.</p>
        </div>
        <button className="btn btn-ghost">
          <TrendingUp /> November 2025
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-top">
              <div className="stat-icon"><s.icon /></div>
              <span className="stat-trend">{s.trend}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Students</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>Latest enrollments this month</div>
            </div>
            <button className="btn btn-ghost">View all <ArrowUpRight size={14} /></button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Group</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="avatar-cell">
                        <div className="avatar-sm">{s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
                        <div>
                          <div className="cell-strong">{s.name}</div>
                          <div className="cell-dim" style={{ fontSize: 12 }}>{s.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge info">{s.group}</span></td>
                    <td className="cell-strong">{s.balance.toLocaleString()} UZS</td>
                    <td>
                      <span className={`badge ${s.status === "Active" ? "success" : "warn"}`}>{s.status}</span>
                    </td>
                    <td className="cell-dim">{s.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {quickLinks.map((q) => (
            <button className="quick-card" key={q.label}>
              <div className="ico"><q.icon /></div>
              <div style={{ textAlign: "left", flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{q.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{q.sub}</div>
              </div>
              <ArrowUpRight size={16} style={{ color: "var(--text-mute)" }} />
            </button>
          ))}

          <div className="card" style={{ padding: 22 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>Today's Highlights</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { k: "New enrollments", v: "+8" },
                { k: "Classes today", v: "12" },
                { k: "Pending payments", v: "5" },
                { k: "Avg attendance", v: "94%" },
              ].map((r) => (
                <div key={r.k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--text-dim)" }}>{r.k}</span>
                  <span style={{ fontWeight: 600 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}