import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminNavbar.css"; // kalau kamu pakai CSS eksternal

function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <h2 className="logo">Reforest Admin</h2>
      <ul>
        <li>
          <NavLink to="/admin/pohon" activeclassname="active">
            Manajemen Pohon
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/artikel" activeclassname="active">
            Manajemen Artikel
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/faq" activeclassname="active">
            Manajemen FAQ
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/user" activeclassname="active">
            Manajemen User
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
