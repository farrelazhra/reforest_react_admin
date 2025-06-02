import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import AdminNavbar from "../admin/AdminNavbar";
import PohonManager from "../pohon/PohonManager";
import ArtikelManager from "../artikel/ArtikelManager";
import FAQManager from "../faq/FAQManager";
import UserManager from "../user/UserManager";

import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const isLoggedIn = true; // sesuaikan dengan autentikasi sesungguhnya

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/adminlogin');
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
