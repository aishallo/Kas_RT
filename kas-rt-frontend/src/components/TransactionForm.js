import React, { useState } from "react";
import axios from "axios";

const TransactionForm = ({ onTransactionAdded }) => {
  // 1. State untuk menyimpan isian formulir
  const [jenis, setJenis] = useState("Pemasukan");
  const [nominal, setNominal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Fungsi yang dijalankan saat tombol Submit diklik
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah halaman web reload
    setLoading(true);

    try {
      // Data yang akan dikirim ke Backend
      const newData = {
        jenis,
        nominal: Number(nominal),
        keterangan,
      };

      // Tembak API Express.js
      await axios.post("http://localhost:5000/api/transactions", newData, {
        withCredentials: true,
      });

      alert("Data transaksi berhasil ditambahkan!");

      // Kosongkan formulir setelah sukses menyimpan
      setNominal("");
      setKeterangan("");

      // Jika komponen ini dipanggil di halaman yang sama dengan Tabel,
      // panggil fungsi onTransactionAdded untuk me-refresh tabel secara otomatis.
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error) {
      console.error("Gagal menyimpan transaksi:", error);
      alert("Terjadi kesalahan saat menyimpan data. Cek console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "500px",
        marginBottom: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h3>Tambah Transaksi Baru</h3>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {/* Input Jenis Transaksi */}
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Jenis Transaksi:
          </label>
          <select
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="Pemasukan">Pemasukan</option>
            <option value="Pengeluaran">Pengeluaran</option>
          </select>
        </div>

        {/* Input Nominal */}
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Nominal (Rp):
          </label>
          <input
            type="number"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            placeholder="Contoh: 50000"
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        {/* Input Keterangan */}
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Keterangan:
          </label>
          <textarea
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Contoh: Iuran kebersihan Bapak A"
            required
            rows="3"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        {/* Tombol Simpan */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Menyimpan..." : "Simpan Transaksi"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
