import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Students from "./pages/students.jsx";
import Teachers from "./pages/teachers.jsx";
import Courses from "./pages/courses.jsx";
import Groups from "./pages/groups.jsx";
import Payments from "./pages/payments.jsx";
import Rooms from "./pages/rooms.jsx";
import Settings from "./pages/settings.jsx";
import AuthGate from "./components/authgate.jsx";
import { useAuth } from "./auth/useauth.js";

function ProtectedPage({ access, children }) {
  const { hasAccess } = useAuth();

  if (!hasAccess(access)) {
    return (
      <div className="page">
        <div className="card settings-section">
          <div className="card-title">Access denied</div>
          <p className="page-sub">Bu sahifani ko'rish uchun access berilmagan.</p>
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <AuthGate>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ProtectedPage access="dashboard:view"><Dashboard /></ProtectedPage>} />
          <Route path="/students" element={<ProtectedPage access="students:view"><Students /></ProtectedPage>} />
          <Route path="/teachers" element={<ProtectedPage access="teachers:view"><Teachers /></ProtectedPage>} />
          <Route path="/courses" element={<ProtectedPage access="courses:view"><Courses /></ProtectedPage>} />
          <Route path="/groups" element={<ProtectedPage access="groups:view"><Groups /></ProtectedPage>} />
          <Route path="/payments" element={<ProtectedPage access="payments:view"><Payments /></ProtectedPage>} />
          <Route path="/rooms" element={<ProtectedPage access="rooms:view"><Rooms /></ProtectedPage>} />
          <Route path="/settings" element={<ProtectedPage access="settings:view"><Settings /></ProtectedPage>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthGate>
  );
}
