import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Teachers from "./pages/Teachers.jsx";
import Courses from "./pages/Courses.jsx";
import Groups from "./pages/Groups.jsx";
import Payments from "./pages/Payments.jsx";
import Rooms from "./pages/Rooms.jsx";
import Settings from "./pages/Settings.jsx";
import AuthGate from "./components/AuthGate.jsx";
import { useAuth } from "./auth/AuthContext.jsx";

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
