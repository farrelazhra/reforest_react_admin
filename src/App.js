import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./components/auth/AdminLogin";
import AdminLayout from "./components/layout/AdminLayout";
import PohonManager from "./components/pohon/PohonManager";
import ArtikelManager from "./components/artikel/ArtikelManager";
import FAQManager from "./components/faq/FAQManager";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="*" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
          </>
        ) : (
          <>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/pohon" />} />
              <Route path="pohon" element={<PohonManager />} />
              <Route path="artikel" element={<ArtikelManager />} />
              <Route path="faq" element={<FAQManager />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
