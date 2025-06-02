import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import AdminLogin from "./components/auth/AdminLogin";
import AdminLayout from "./components/layout/AdminLayout";
import PohonManager from "./components/pohon/PohonManager";
import ArtikelManager from "./components/artikel/ArtikelManager";
import FAQManager from "./components/faq/FAQManager";
import UserManager from "./components/user/UserManager";

import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil token dan email saat pertama kali load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    setToken(storedToken);
    setUserEmail(storedEmail);
    setLoading(false);
  }, []);

  // Saat login berhasil, simpan token dan email
  const handleLoginSuccess = (newToken, email) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userEmail", email);
    setToken(newToken);
    setUserEmail(email);
  };

  // Saat logout, hapus token dan email
  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUserEmail(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppRoutes
        token={token}
        userEmail={userEmail}
        onLoginSuccess={handleLoginSuccess}
        onLogout={onLogout}
      />
    </Router>
  );
}

function AdminLoginWrapper({ token, userEmail, onLogout, onLoginSuccess }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loginEmail, setLoginEmail] = useState(null);

  useEffect(() => {
    if (token && loginEmail) {
      if (loginEmail === userEmail) {
        // Kalau user sama, langsung redirect ke /admin/pohon tanpa logout
        navigate("/admin/pohon", { replace: true });
        setIsLoggingOut(false);
      } else {
        // Kalau beda user, logout dulu
        setIsLoggingOut(true);
        onLogout();
      }
    } else if (!token) {
      // Kalau token gak ada, siap tampilkan login form
      setIsLoggingOut(false);
    }
  }, [token, loginEmail, userEmail, onLogout, navigate]);

  if (isLoggingOut) {
    return <div>Preparing login page...</div>;
  }

  return (
    <AdminLogin
      onLoginSuccess={(newToken, email) => {
        setLoginEmail(email);
        onLoginSuccess(newToken, email);
        // Redirect akan dilakukan di useEffect di atas
      }}
    />
  );
}

function AppRoutes({ token, userEmail, onLoginSuccess, onLogout }) {
  const userLoggedIn = !!token;

  return (
    <Routes>
      <Route
        path="/adminlogin"
        element={
          <AdminLoginWrapper
            token={token}
            userEmail={userEmail}
            onLogout={onLogout}
            onLoginSuccess={onLoginSuccess}
          />
        }
      />

      {userLoggedIn && (
        <Route path="/admin" element={<AdminLayout onLogout={onLogout} />}>
          <Route index element={<Navigate to="/admin/pohon" replace />} />
          <Route path="pohon" element={<PohonManager token={token} onLogout={onLogout} />} />
          <Route path="artikel" element={<ArtikelManager token={token} onLogout={onLogout} />} />
          <Route path="faq" element={<FAQManager token={token} onLogout={onLogout} />} />
          <Route path="user" element={<UserManager token={token} onLogout={onLogout} />} />
        </Route>
      )}

      <Route
        path="*"
        element={<Navigate to={userLoggedIn ? "/admin" : "/adminlogin"} replace />}
      />
    </Routes>
  );
}

export default App;
