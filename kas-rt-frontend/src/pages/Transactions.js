import React, { useState, useEffect } from "react";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    jenis: "Pemasukan",
    nominal: "",
    Keterangan: "",
    tanggal: "",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://kas-rt-api-three.vercel.app/api/transactions",
        { withCredentials: true },
      );
      setTransactions(res.data);
    } catch (err) {
      console.error("Gagal memuat data transaksi", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `https://kas-rt-api-three.vercel.app/api/transactions/${editId}`,
          form,
          { withCredentials: true },
        );
        setEditId(null);
      } else {
        await axios.post(
          "https://kas-rt-api-three.vercel.app/api/transactions",
          form,
          { withCredentials: true },
        );
      }
      setForm({ jenis: "Pemasukan", nominal: "", Keterangan: "", tanggal: "" });
      fetchData();
    } catch (err) {
      console.error("Gagal menyimpan data", err);
    }
  };

  const handleEdit = (trx) => {
    setEditId(trx._id);
    setForm({
      jenis: trx.jenis,
      nominal: trx.nominal,
      Keterangan: trx.Keterangan,
      tanggal: trx.tanggal ? trx.tanggal.split("T")[0] : "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus data kas ini?")) {
      try {
        await axios.delete(
          `https://kas-rt-api-three.vercel.app/api/transactions/${id}`,
          { withCredentials: true },
        );
        fetchData();
      } catch (err) {
        console.error("Gagal menghapus data", err);
      }
    }
  };

  const filteredData = transactions.filter((trx) => {
    const matchKeterangan = trx.Keterangan.toLowerCase().includes(
      search.toLowerCase(),
    );
    const matchJenis = filterJenis ? trx.jenis === filterJenis : true;
    return matchKeterangan && matchJenis;
  });

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h2>Manajemen Data Transaksi Kas RT</h2>

      {/* Form Input / Edit */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h3>{editId ? "Edit Transaksi" : "Tambah Transaksi Baru"}</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "15px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Jenis
            </label>
            <select
              value={form.jenis}
              onChange={(e) => setForm({ ...form, jenis: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="Pemasukan">Pemasukan</option>
              <option value="Pengeluaran">Pengeluaran</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Nominal (Rp)
            </label>
            <input
              type="number"
              placeholder="Contoh: 50000"
              value={form.nominal}
              onChange={(e) =>
                setForm({ ...form, nominal: Number(e.target.value) })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Keterangan
            </label>
            <input
              type="text"
              placeholder="Contoh: Iuran Warga RT 05"
              value={form.Keterangan}
              onChange={(e) => setForm({ ...form, Keterangan: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Tanggal
            </label>
            <input
              type="date"
              value={form.tanggal}
              onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          style={{
            background: editId ? "#ffc107" : "#28a745",
            color: editId ? "#000" : "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {editId ? "Perbarui Data" : "Simpan Transaksi"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({
                jenis: "Pemasukan",
                nominal: "",
                Keterangan: "",
                tanggal: "",
              });
            }}
            style={{
              marginLeft: "10px",
              background: "#6c757d",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Batal
          </button>
        )}
      </form>

      {/* Filter & Search */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Cari keterangan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={filterJenis}
          onChange={(e) => setFilterJenis(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Semua Jenis</option>
          <option value="Pemasukan">Pemasukan</option>
          <option value="Pengeluaran">Pengeluaran</option>
        </select>
      </div>

      {/* Tabel Data */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <thead>
          <tr style={{ background: "#333", color: "#fff", textAlign: "left" }}>
            <th style={{ padding: "10px" }}>Tanggal</th>
            <th style={{ padding: "10px" }}>Jenis</th>
            <th style={{ padding: "10px" }}>Keterangan</th>
            <th style={{ padding: "10px" }}>Nominal</th>
            <th style={{ padding: "10px" }}>Penginput</th>
            <th style={{ padding: "10px", textAlign: "center" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                style={{ textAlign: "center", padding: "20px", color: "#777" }}
              >
                Belum ada data transaksi.
              </td>
            </tr>
          ) : (
            filteredData.map((trx) => (
              <tr key={trx._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>
                  {trx.tanggal ? trx.tanggal.split("T")[0] : "-"}
                </td>
                <td
                  style={{
                    padding: "10px",
                    fontWeight: "bold",
                    color: trx.jenis === "Pemasukan" ? "#28a745" : "#dc3545",
                  }}
                >
                  {trx.jenis}
                </td>
                <td style={{ padding: "10px" }}>{trx.Keterangan}</td>
                <td style={{ padding: "10px" }}>{formatRupiah(trx.nominal)}</td>
                <td style={{ padding: "10px" }}>
                  {trx.diinputOleh ? trx.diinputOleh.nama : "Sistem"}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEdit(trx)}
                    style={{
                      marginRight: "5px",
                      background: "#ffc107",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trx._id)}
                    style={{
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
