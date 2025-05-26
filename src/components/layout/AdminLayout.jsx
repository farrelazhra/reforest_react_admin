import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminNavbar from "../admin/AdminNavbar";
import PohonManager from "../pohon/PohonManager";
import ArtikelManager from "../artikel/ArtikelManager";
import FAQManager from "../faq/FAQManager";

import "./AdminLayout.css";
import UserManager from "../user/UserManager";

const AdminLayout = () => {
  // Dummy auth check (replace with real logic)
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
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
