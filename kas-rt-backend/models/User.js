const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    nama: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fotoProfil: {
      type: String,
    },
    role: {
      type: String,
      enum: ["warga", "admin"],
      default: "warga",
    },
    tanggalLoginTerakhir: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
