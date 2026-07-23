import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import Transactions from "./pages/Transactions";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://kas-rt-api-three.vercel.app/api/current_user",
          {
            withCredentials: true,
          },
        );

        if (res.data && res.data._id) {
          setUser(res.data);
        }
      } catch (error) {
        console.error("Error fetching user", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("https://kas-rt-api-three.vercel.app/api/logout", {
        withCredentials: true,
      });
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Gagal logout", error);
    }
  };

  if (loading)
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        Memuat sistem keamanan...
      </div>
    );

  return (
    <Router>
      <div style={{ fontFamily: "sans-serif" }}>
        <nav
          style={{
            background: "#333",
            padding: "15px 20px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Dashboard
            </Link>
            {user && (
              <Link
                to="/transactions"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Data Transaksi
              </Link>
            )}
          </div>

          <div>
            {user ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <img
                  src={user.fotoProfil}
                  alt="Profil"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                />
                <span style={{ fontWeight: "bold" }}>{user.nama}</span>
                <button
                  onClick={handleLogout}
                  style={{
                    marginLeft: "15px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/transactions"
            element={user ? <Transactions /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
