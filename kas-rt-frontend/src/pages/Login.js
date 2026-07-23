import React from "react";

const Login = () => {
  const handleGoogleLogin = () => {
    // Mengarahkan ke backend Vercel untuk autentikasi Google OAuth
    window.location.href = "https://kas-rt-api-three.vercel.app/auth/google";
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Silakan Login Terlebih Dahulu</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Aplikasi Pengelolaan Kas RT - Universitas Paramadina
      </p>
      <button
        onClick={handleGoogleLogin}
        style={{
          background: "#4285F4",
          color: "white",
          border: "none",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        Login dengan Akun Google
      </button>
    </div>
  );
};

export default Login;
