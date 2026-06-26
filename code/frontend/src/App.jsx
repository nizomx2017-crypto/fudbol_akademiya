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

export default function App() {
  return (
    <AuthGate>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthGate>
  );
}
