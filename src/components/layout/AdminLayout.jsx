import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ← tidak perlu useNavigate lagi

import AdminNavbar from "../admin/AdminNavbar";
import PohonManager from "../pohon/PohonManager";
import ArtikelManager from "../artikel/ArtikelManager";
import FAQManager from "../faq/FAQManager";
import UserManager from "../user/UserManager";

import "./AdminLayout.css";

const AdminLayout = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = 'http://localhost:3000/login';
  };

  if (!isLoggedIn) {
    return <Navigate to="/adminlogin" />;
  }

  return (
    <div className="admin-layout">
      <AdminNavbar onLogout={handleLogout} />
      <main className="admin-content">
        <Routes>
          <Route path="pohon" element={<PohonManager />} />
          <Route path="artikel" element={<ArtikelManager />} />
          <Route path="faq" element={<FAQManager />} />
          <Route path="user" element={<UserManager />} />
          <Route path="*" element={<Navigate to="pohon" />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;
