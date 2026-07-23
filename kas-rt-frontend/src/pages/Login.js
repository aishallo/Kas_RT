import React from "react";

const Login = () => {
  const handleLogin = () => {
    // Mengarahkan browser ke rute Google OAuth di backend
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Selamat Datang di Sistem Kas RT</h2>
      <p style={{ marginBottom: "30px" }}>
        Silakan login menggunakan akun Google Anda untuk melanjutkan.
      </p>

      <button
        onClick={handleLogin}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        Login dengan Google
      </button>
    </div>
  );
};

export default Login;
