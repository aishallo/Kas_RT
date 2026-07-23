import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// Import semua halaman yang sudah kita buat
import Transactions from "./pages/Transactions";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // <-- Halaman Dashboard yang baru diimpor di sini

function App() {
  // 1. State untuk menyimpan data profil pengguna yang login
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Mengecek status login setiap kali aplikasi pertama kali dimuat
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/current_user", {
          withCredentials: true, // Wajib agar cookie/session Google ikut terkirim
        });

        // Jika backend mengembalikan data yang memiliki _id, berarti user berhasil login
        if (res.data && res.data._id) {
          setUser(res.data);
        }
      } catch (error) {
        console.error("Error fetching user", error);
      } finally {
        setLoading(false); // Selesai loading, tampilkan halaman
      }
    };
    fetchUser();
  }, []);

  // 3. Fungsi untuk Logout
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/logout", {
        withCredentials: true,
      });
      setUser(null);
      window.location.href = "/login"; // Refresh dan kembalikan ke halaman login
    } catch (error) {
      console.error("Gagal logout", error);
    }
  };

  // Tampilkan layar putih/loading sementara aplikasi mengecek session ke backend
  if (loading)
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        Memuat sistem keamanan...
      </div>
    );

  return (
    <Router>
      <div style={{ fontFamily: "sans-serif" }}>
        {/* ================= NAVBAR DINAMIS ================= */}
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
          {/* Menu Sebelah Kiri */}
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

            {/* Menu Data Transaksi HANYA muncul jika 'user' tidak aktif (sudah login) */}
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

          {/* Menu Sebelah Kanan (Profil / Tombol Login) */}
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

        {/* ================= SISTEM PROTEKSI RUTE (ROUTES) ================= */}
        <Routes>
          {/* Rute ini sekarang memanggil komponen Dashboard yang ada di pages/Dashboard.js */}
          <Route path="/" element={<Dashboard />} />

          {/* Jika belum login, 'user' bernilai null, maka Navigate akan melemparnya ke halaman /login */}
          <Route
            path="/transactions"
            element={user ? <Transactions /> : <Navigate to="/login" />}
          />

          {/* Mencegah orang yang sudah login masuk ke halaman login lagi */}
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
