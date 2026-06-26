import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main">
        <Navbar onMenu={() => setOpen((v) => !v)} />
            <h1 style={{ color: "white" }}>TEST CHIQDI</h1>
        <Outlet />
      </div>
    </div>
  );
}
