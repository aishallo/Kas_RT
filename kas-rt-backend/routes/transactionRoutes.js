const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// ==========================================
// 1. CREATE: Menambah Data Kas RT Baru
// ==========================================
router.post("/", async (req, res) => {
  try {
    // req.user._id akan terisi otomatis jika login via browser (Google).
    // req.body.diinputOleh digunakan sebagai cadangan jika Anda mengetes API lewat Postman.
    const userId = req.user ? req.user._id : req.body.diinputOleh;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "ID User (diinputOleh) wajib diisi!" });
    }

    const transaksiBaru = new Transaction({
      jenis: req.body.jenis,
      nominal: req.body.nominal,
      keterangan: req.body.keterangan,
      tanggal: req.body.tanggal, // Opsional, akan otomatis terisi hari ini jika kosong
      diinputOleh: userId,
    });

    const dataTersimpan = await transaksiBaru.save();
    res.status(201).json(dataTersimpan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 2. READ: Mengambil Data (Dengan Filter, Search, & Sort)
// ==========================================
router.get("/", async (req, res) => {
  try {
    const { jenis, search, sort } = req.query;
    let query = {};

    // FITUR FILTER: Misal hanya ingin melihat "Pemasukan" atau "Pengeluaran"
    if (jenis) {
      query.jenis = jenis;
    }

    // FITUR SEARCH: Mencari berdasarkan keterangan (misal: "Iuran Pak Budi")
    if (search) {
      // $regex memungkinkan pencarian teks sebagian, $options: 'i' agar tidak mempedulikan huruf besar/kecil
      query.keterangan = { $regex: search, $options: "i" };
    }

    // FITUR SORTING: Mengurutkan dari yang terbaru atau terlama
    let sortOption = { tanggal: -1 }; // Default: -1 (Terbaru ke Terlama)
    if (sort === "lama") {
      sortOption = { tanggal: 1 }; // 1 (Terlama ke Terbaru)
    }

    // populate() digunakan agar data user yang menginput ikut ditampilkan (tidak hanya ID-nya saja)
    const transaksi = await Transaction.find(query)
      .sort(sortOption)
      .populate("diinputOleh", "nama email");

    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 3. UPDATE: Mengubah Data Transaksi (Misal ada salah ketik nominal)
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const transaksiUpdate = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // Parameter ini memastikan data yang dikembalikan API adalah data yang *sudah* diubah
    );

    if (!transaksiUpdate)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    res.json(transaksiUpdate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 4. DELETE: Menghapus Data Transaksi
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const transaksiHapus = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaksiHapus)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    res.json({ message: "Transaksi kas RT berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
