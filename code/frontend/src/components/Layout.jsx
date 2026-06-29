import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar.jsx";
import Navbar from "./navbar.jsx";

export default function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main">
        <Navbar onMenu={() => setOpen((v) => !v)} />
        <Outlet />
      </div>
    </div>
  );
}
