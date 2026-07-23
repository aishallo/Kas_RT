import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionTable = ({ refreshTrigger }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [loading, setLoading] = useState(false);

  // State baru khusus untuk fitur Edit
  const [editId, setEditId] = useState(null);
  const [editNominal, setEditNominal] = useState("");
  const [editKeterangan, setEditKeterangan] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/transactions",
        {
          params: { search: search, jenis: filterJenis },
          withCredentials: true,
        },
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterJenis, refreshTrigger]);

  // Fungsi untuk mengaktifkan mode Edit
  const handleEditClick = (trx) => {
    setEditId(trx._id);
    setEditNominal(trx.nominal);
    setEditKeterangan(trx.keterangan);
  };

  // Fungsi untuk menyimpan perubahan ke Backend (UPDATE)
  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/transactions/${id}`,
        {
          nominal: Number(editNominal),
          keterangan: editKeterangan,
        },
        { withCredentials: true },
      );

      alert("Data transaksi berhasil diperbarui!");
      setEditId(null); // Matikan mode edit
      fetchTransactions(); // Refresh tabel dengan data terbaru
    } catch (error) {
      console.error("Gagal mengubah data:", error);
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
          withCredentials: true,
        });
        alert("Data transaksi berhasil dihapus!");
        fetchTransactions();
      } catch (error) {
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Daftar Kas RT</h2>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Cari keterangan... (misal: Budi)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />
        <select
          value={filterJenis}
          onChange={(e) => setFilterJenis(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">Semua Transaksi</option>
          <option value="Pemasukan">Pemasukan</option>
          <option value="Pengeluaran">Pengeluaran</option>
        </select>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th>Tanggal</th>
              <th>Jenis</th>
              <th>Keterangan</th>
              <th>Diinput Oleh</th>
              <th>Nominal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((trx) => (
                <tr key={trx._id}>
                  {/* LOGIKA PERCABANGAN: Jika baris ini sedang diedit, tampilkan input box */}
                  {editId === trx._id ? (
                    <>
                      <td>
                        {new Date(trx.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td
                        style={{
                          color: trx.jenis === "Pemasukan" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {trx.jenis}
                      </td>
                      <td>
                        <textarea
                          value={editKeterangan}
                          onChange={(e) => setEditKeterangan(e.target.value)}
                          style={{ width: "100%" }}
                        />
                      </td>
                      <td>
                        {trx.diinputOleh ? trx.diinputOleh.nama : "Sistem"}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editNominal}
                          onChange={(e) => setEditNominal(e.target.value)}
                          style={{ width: "100%" }}
                        />
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          display: "flex",
                          gap: "5px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => handleUpdate(trx._id)}
                          style={{
                            padding: "6px",
                            background: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          style={{
                            padding: "6px",
                            background: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Batal
                        </button>
                      </td>
                    </>
                  ) : (
                    /* Tampilan Normal (Read Mode) */
                    <>
                      <td>
                        {new Date(trx.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td
                        style={{
                          color: trx.jenis === "Pemasukan" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {trx.jenis}
                      </td>
                      <td>{trx.keterangan}</td>
                      <td>
                        {trx.diinputOleh ? trx.diinputOleh.nama : "Sistem"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {formatRupiah(trx.nominal)}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          display: "flex",
                          gap: "5px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => handleEditClick(trx)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#ffc107",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trx._id)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Hapus
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Tidak ada data transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionTable;
