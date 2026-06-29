import {
  ArrowUpRight,
  BookOpen,
  CreditCard,
  DoorOpen,
  GraduationCap,
  Layers,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  mockCourses,
  mockGroups,
  mockPayments,
  mockRooms,
  mockStudents,
  mockTeachers,
} from "../services/mockdata.js";
import { useAuth } from "../auth/useauth.js";

const stats = [
  { label: "Total Students", value: mockStudents.length, trend: "+12%", icon: Users, access: "students:view" },
  { label: "Total Teachers", value: mockTeachers.length, trend: "+3%", icon: GraduationCap, access: "teachers:view" },
  { label: "Total Courses", value: mockCourses.length, trend: "+1", icon: BookOpen, access: "courses:view" },
  { label: "Total Groups", value: mockGroups.length, trend: "+2", icon: Layers, access: "groups:view" },
  {
    label: "Total Payments",
    value: `${mockPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()} UZS`,
    trend: "+18%",
    icon: CreditCard,
    access: "payments:view",
    adminOnly: true,
  },
  { label: "Total Rooms", value: mockRooms.length, trend: "100%", icon: DoorOpen, access: "rooms:view", adminOnly: true },
];

const quickLinks = [
  { label: "New enrollment", sub: "Register a new student", icon: Users, access: "students:create", adminOnly: true },
  { label: "Schedule class", sub: "Plan today's lessons", icon: Layers, access: "groups:view", hiddenRoles: ["STUDENT"] },
  { label: "Record payment", sub: "Log a fresh payment", icon: CreditCard, access: "payments:create", adminOnly: true },
  { label: "My courses", sub: "Review active course list", icon: BookOpen, access: "courses:view", roles: ["TEACHER", "STUDENT"] },
  { label: "My groups", sub: "Check current group schedule", icon: Layers, access: "groups:view", roles: ["TEACHER", "STUDENT"] },
];

export default function Dashboard() {
  const { hasAccess, hasFullAccess, user } = useAuth();
  const role = user?.role || "ADMIN";
  const recent = mockStudents.slice(0, 6);
  const visibleStats = stats.filter((item) => canShowItem(item, { hasAccess, hasFullAccess, role }));
  const visibleQuickLinks = quickLinks.filter((item) => canShowItem(item, { hasAccess, hasFullAccess, role }));
  const showStudentTable = hasFullAccess || hasAccess("students:view");
  const showBalanceColumn = hasFullAccess || hasAccess("payments:view");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {titleCaseRole(role)}</h1>
          <p className="page-sub">{getSubtitle(role)}</p>
        </div>
        <button className="btn btn-ghost">
          <TrendingUp /> November 2025
        </button>
      </div>

      <div className="stats-grid">
        {visibleStats.map((stat) => (
          <div className="stat" key={stat.label}>
            <div className="stat-top">
              <div className="stat-icon"><stat.icon /></div>
              <span className="stat-trend">{stat.trend}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {showStudentTable ? (
          <StudentOverview
            recent={recent}
            role={role}
            showBalanceColumn={showBalanceColumn}
          />
        ) : (
          <CourseOverview role={role} />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {visibleQuickLinks.map((link) => (
            <button className="quick-card" key={link.label}>
              <div className="ico"><link.icon /></div>
              <div style={{ textAlign: "left", flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{link.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{link.sub}</div>
              </div>
              <ArrowUpRight size={16} style={{ color: "var(--text-mute)" }} />
            </button>
          ))}

          <div className="card" style={{ padding: 22 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>
              {role === "STUDENT" ? "My Progress" : "Today's Highlights"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {getHighlights(role).map((row) => (
                <div key={row.k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--text-dim)" }}>{row.k}</span>
                  <span style={{ fontWeight: 600 }}>{row.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentOverview({ recent, role, showBalanceColumn }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Recent Students</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
            {role === "TEACHER" ? "Learners in your active groups" : "Latest enrollments this month"}
          </div>
        </div>
        <button className="btn btn-ghost">View all <ArrowUpRight size={14} /></button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Group</th>
              {showBalanceColumn ? <th>Balance</th> : null}
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="avatar-cell">
                    <div className="avatar-sm">
                      {student.name.split(" ").map((name) => name[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="cell-strong">{student.name}</div>
                      <div className="cell-dim" style={{ fontSize: 12 }}>{student.phone}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge info">{student.group}</span></td>
                {showBalanceColumn ? (
                  <td className="cell-strong">{Number(student.balance || 0).toLocaleString()} UZS</td>
                ) : null}
                <td>
                  <span className={`badge ${student.status === "Active" ? "success" : "warn"}`}>
                    {student.status}
                  </span>
                </td>
                <td className="cell-dim">{student.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseOverview({ role }) {
  const courses = mockCourses.slice(0, role === "STUDENT" ? 3 : 5);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{role === "STUDENT" ? "Available Courses" : "Course Overview"}</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
            {role === "STUDENT" ? "Courses and groups available to you" : "Courses connected to your active groups"}
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Duration</th>
              <th>Level</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="cell-strong">{course.title}</td>
                <td className="cell-dim">{course.duration}</td>
                <td><span className="badge info">{course.level}</span></td>
                <td className="cell-dim">{course.teacher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function canShowItem(item, { hasAccess, hasFullAccess, role }) {
  if (item.adminOnly && !hasFullAccess) {
    return false;
  }

  if (item.roles && !item.roles.includes(role)) {
    return false;
  }

  if (item.hiddenRoles?.includes(role)) {
    return false;
  }

  return hasFullAccess || hasAccess(item.access);
}

function getHighlights(role) {
  if (role === "TEACHER") {
    return [
      { k: "Classes today", v: "5" },
      { k: "Active groups", v: "4" },
      { k: "Students in groups", v: "38" },
      { k: "Avg attendance", v: "94%" },
    ];
  }

  if (role === "STUDENT") {
    return [
      { k: "Active courses", v: "3" },
      { k: "Groups joined", v: "2" },
      { k: "Upcoming classes", v: "4" },
      { k: "Progress", v: "72%" },
    ];
  }

  return [
    { k: "New enrollments", v: "+8" },
    { k: "Classes today", v: "12" },
    { k: "Pending payments", v: "5" },
    { k: "Avg attendance", v: "94%" },
  ];
}

function getSubtitle(role) {
  if (role === "TEACHER") {
    return "Your classes, groups and students for today.";
  }

  if (role === "STUDENT") {
    return "Your courses, groups and learning progress.";
  }

  return "Here is what's happening at your education center today.";
}

function titleCaseRole(role) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}
