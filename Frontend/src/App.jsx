import "./App.css";

import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import ShopOwnerDashboard from "./pages/ShopOwnerDashboard";
import ShopOwnerLogin from "./pages/shopOwnerLogin";
import LandingPage from "./pages/Landing";
import GoogleAuth from "./pages/userLogin";
import UserDashboard from "./pages/UserDashboard";
import OwnerPage from "./pages/ownerPage";
import ShopQRCode from "./pages/shopQRCode";

import API from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await API.get("/auth/me");

      if (response.data.role === "user") {
        setUser(response.data.user);
        setOwner(null);
        setLoggedIn(true);
      } else if (response.data.role === "owner") {
        setOwner(response.data.owner);
        setUser(null);
        setLoggedIn(true);
      } else {
        setUser(null);
        setOwner(null);
        setLoggedIn(false);
      }
    } catch {
      setUser(null);
      setOwner(null);
      setLoggedIn(false);
    } finally {
      setAuthChecked(true);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggedIn(false);
      setUser(null);
      setOwner(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const checkInitialAuth = async () => {
      try {
        const response = await API.get("/auth/me");

        if (cancelled) return;

        if (response.data.role === "user") {
          setUser(response.data.user);
          setOwner(null);
          setLoggedIn(true);
        } else if (response.data.role === "owner") {
          setOwner(response.data.owner);
          setUser(null);
          setLoggedIn(true);
        } else {
          setUser(null);
          setOwner(null);
          setLoggedIn(false);
        }
      } catch {
        if (cancelled) return;

        setUser(null);
        setOwner(null);
        setLoggedIn(false);
      } finally {
        if (!cancelled) {
          setAuthChecked(true);
        }
      }
    };

    const handleAuthChange = () => {
      checkAuth();
    };

    checkInitialAuth();

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      cancelled = true;
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  // Don't render routes until authentication is checked
  if (!authChecked) {
    return null;
  }

  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          owner ? (
            <OwnerPage owner={owner} onLogout={handleLogout} />
          ) : (
            <LandingPage loggedIn={loggedIn} onLogout={handleLogout} />
          )
        }
      />

      {/* USER DASHBOARD */}
      <Route
        path="/user/:shopCode"
        element={
          user ? <UserDashboard user={user} /> : <Navigate to="/" replace />
        }
      />

      {/* OWNER DASHBOARD */}
      <Route
        path="/owner/dashboard"
        element={
          owner ? (
            <ShopOwnerDashboard owner={owner} onLogout={handleLogout} />
          ) : (
            <Navigate to="/owner/auth/google" replace />
          )
        }
      />

      {/* OWNER LOGIN */}
      <Route path="/owner/auth/google" element={<ShopOwnerLogin />} />

      {/* USER LOGIN */}
      <Route path="/user/auth/google" element={<GoogleAuth />} />

      {/* OWNER QR */}
      <Route
        path="/owner/qr"
        element={
          owner ? (
            <ShopQRCode owner={owner} />
          ) : (
            <Navigate to="/owner/auth/google" replace />
          )
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;