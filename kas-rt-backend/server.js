const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");

// Load konfigurasi dari file .env
dotenv.config();

// Load konfigurasi Passport Google OAuth
require("./config/passport")(passport);

// Hubungkan ke MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Port Frontend (React) nanti
    credentials: true, // Mengizinkan cookie session dikirim ke frontend
  }),
);
app.use(express.json());

// Konfigurasi Session (Keamanan Cookie)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// Inisialisasi Passport
app.use(passport.initialize());
app.use(passport.session());

// ==========================================
// RUTE (ROUTES) GOOGLE OAUTH 2.0
// ==========================================

// 1. Rute saat tombol "Login dengan Google" diklik
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// 2. Rute Callback: Tempat Google mengirim data kembali setelah warga berhasil login
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login-gagal" }),
  (req, res) => {
    // Arahkan kembali ke aplikasi React setelah berhasil login
    res.redirect("http://localhost:3000/");
  },
);

// 3. Rute untuk mengecek siapa yang sedang login saat ini
app.get("/api/current_user", (req, res) => {
  res.send(req.user);
});

// Rute untuk CRUD Transaksi Kas RT
app.use("/api/transactions", require("./routes/transactionRoutes"));

// 4. Rute untuk Logout
app.get("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.send("Anda telah berhasil logout.");
  });
});

// ==========================================

app.get("/", (req, res) => {
  res.send("API Kas RT Berjalan...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan dalam mode development di port ${PORT}`);
});
