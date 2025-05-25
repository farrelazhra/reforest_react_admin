import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <h2 className="admin-logo">Reforest Admin</h2>
      <ul>
        <li>
          <NavLink to="/admin/pohon" className={({ isActive }) => (isActive ? "active" : "")}>
            Manajemen Pohon
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/artikel" className={({ isActive }) => (isActive ? "active" : "")}>
            Manajemen Artikel
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/faq" className={({ isActive }) => (isActive ? "active" : "")}>
            Manajemen FAQ
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
