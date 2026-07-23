import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "https://kas-rt-api-three.vercel.app/api/transactions",
          {
            withCredentials: true,
          },
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Gagal mengambil data untuk dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalPemasukan = transactions
    .filter((trx) => trx.jenis === "Pemasukan")
    .reduce((total, trx) => total + trx.nominal, 0);

  const totalPengeluaran = transactions
    .filter((trx) => trx.jenis === "Pengeluaran")
    .reduce((total, trx) => total + trx.nominal, 0);

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  const dataGrafik = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        data: [totalPemasukan, totalPengeluaran],
        backgroundColor: ["#28a745", "#dc3545"],
        hoverBackgroundColor: ["#218838", "#c82333"],
        borderWidth: 0,
      },
    ],
  };

  if (loading)
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        Menghitung kalkulasi keuangan...
      </div>
    );

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>Dashboard Kas RT</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Ringkasan arus kas dan kesehatan finansial lingkungan RT Anda.
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            flex: "1",
            minWidth: "250px",
            background: "#d4edda",
            padding: "25px",
            borderRadius: "12px",
            borderLeft: "6px solid #28a745",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: 0, color: "#155724", fontSize: "1.1rem" }}>
            Total Pemasukan
          </h3>
          <h1 style={{ margin: "15px 0 0 0", color: "#155724" }}>
            {formatRupiah(totalPemasukan)}
          </h1>
        </div>

        <div
          style={{
            flex: "1",
            minWidth: "250px",
            background: "#f8d7da",
            padding: "25px",
            borderRadius: "12px",
            borderLeft: "6px solid #dc3545",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: 0, color: "#721c24", fontSize: "1.1rem" }}>
            Total Pengeluaran
          </h3>
          <h1 style={{ margin: "15px 0 0 0", color: "#721c24" }}>
            {formatRupiah(totalPengeluaran)}
          </h1>
        </div>

        <div
          style={{
            flex: "1",
            minWidth: "250px",
            background: "#cce5ff",
            padding: "25px",
            borderRadius: "12px",
            borderLeft: "6px solid #007bff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: 0, color: "#004085", fontSize: "1.1rem" }}>
            Saldo Akhir Saat Ini
          </h3>
          <h1 style={{ margin: "15px 0 0 0", color: "#004085" }}>
            {formatRupiah(saldoAkhir)}
          </h1>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3
          style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}
        >
          Grafik Arus Kas
        </h3>
        {totalPemasukan === 0 && totalPengeluaran === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>
            Belum ada data transaksi.
          </p>
        ) : (
          <Doughnut data={dataGrafik} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
