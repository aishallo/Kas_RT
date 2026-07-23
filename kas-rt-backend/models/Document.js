const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, // Path lokal atau URL dari cloud storage (misal: Cloudinary)
      required: true,
    },
    tipeFile: {
      type: String,
      enum: ["image", "pdf"],
    },
    diunggahOleh: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Document", documentSchema);
