import React, { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";

const Transactions = () => {
  // State sederhana sebagai pemicu (trigger) agar tabel me-refresh datanya
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    // Mengubah nilai state ini akan membuat useEffect di tabel berjalan ulang
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Kelola Data Kas RT</h1>
      <hr style={{ marginBottom: "20px" }} />

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "300px" }}>
          {/* Kirim fungsi handleTransactionAdded sebagai props */}
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
        </div>
        <div style={{ flex: "2", minWidth: "500px" }}>
          {/* Kirim refreshTrigger sebagai props ke tabel */}
          <TransactionTable refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
