const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    jenis: {
      type: String,
      enum: ["Pemasukan", "Pengeluaran"],
      required: true,
    },
    nominal: {
      type: Number,
      required: true,
    },
    keterangan: {
      type: String,
      required: true,
    },
    tanggal: {
      type: Date,
      default: Date.now,
    },
    diinputOleh: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Berelasi dengan koleksi User
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
