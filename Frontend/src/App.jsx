import "./App.css";

import { Route, Routes } from "react-router-dom";
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

  const handleLogout = async () => {
    await API.post("/auth/logout");
    setLoggedIn(false);
    setUser(null);
    setOwner(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get("/auth/me");

        if (response.data.role === "user") {
          setLoggedIn(true);
          setUser(response.data.user);
          setOwner(null);
        }

        if (response.data.role === "owner") {
          setLoggedIn(true);
          setOwner(response.data.owner);
          setUser(null);
        }
      } catch (error) {
        setLoggedIn(false);
        setUser(null);
        setOwner(null);
      } finally {
        setAuthChecked(true);
      }
    };

    window.addEventListener("authChange", checkAuth);
    checkAuth();

    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  if (!authChecked) return null;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            owner !== null ? (
              <OwnerPage  owner={owner} onLogout={handleLogout} />
            ) : (
              <LandingPage loggedIn={loggedIn} onLogout={handleLogout} />
            )
          }
        />
        <Route
          path="/user/:shopCode"
          element={<UserDashboard user={user}></UserDashboard>}
        />
        <Route
          path="/owner/dashboard"
          element={<ShopOwnerDashboard owner={owner} onLogout={handleLogout} />}
        />
        {/* create the routes for the login externally */}
        <Route path="/owner/auth/google" element={<ShopOwnerLogin></ShopOwnerLogin>} />
        <Route path="/user/auth/google" element={<GoogleAuth></GoogleAuth>} />
        <Route path="/owner/qr" element={<ShopQRCode owner={owner}></ShopQRCode>}/>
      </Routes>
    </>
  );
}

export default App;
