import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar({ onLogout }) {
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
        <li>
          <button 
            className="logout-btn"
            onClick={onLogout}
            style={{
              backgroundColor: '#e53935',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              padding: '6px 12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              marginLeft: '10px'
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
