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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      // Simpan token ke localStorage
      localStorage.setItem("token", urlToken);
      setToken(urlToken);
      // Bersihkan URL dari token
      window.history.replaceState({}, document.title, "/admin");
    } else {
      const storedToken = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("userEmail");
      setToken(storedToken);
      setUserEmail(storedEmail);
    }

    setLoading(false);
  }, []);

  const handleLoginSuccess = (newToken, email) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userEmail", email);
    setToken(newToken);
    setUserEmail(email);
  };

const onLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  setToken(null);
  setUserEmail(null);
  window.location.href = "http://localhost:3000/login"; // Redirect ke halaman login utama
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
        navigate("/admin/pohon", { replace: true });
        setIsLoggingOut(false);
      } else {
        setIsLoggingOut(true);
        onLogout();
      }
    } else if (!token) {
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
