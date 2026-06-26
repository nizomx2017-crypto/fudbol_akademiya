import { Menu, Search, Bell, Sun } from "lucide-react";

export default function Navbar({ onMenu }) {
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
        <div className="avatar">AD</div>
      </div>
    </header>
  );
}