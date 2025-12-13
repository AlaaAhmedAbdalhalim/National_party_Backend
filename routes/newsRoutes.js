const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");

/* =======================
   GET ALL NEWS
======================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM News");
    res.json(rows); // رجوع كل الأخبار
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =======================
   ADD NEWS
======================= */
router.post("/", async (req, res) => {
  try {
    const { title, description, image, date } = req.body;

    // رفع الصورة على Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image);

    // حفظ البيانات في DB
    await db.query(
      "INSERT INTO News (Title, Description, Image, Date) VALUES (?, ?, ?, ?)",
      [title, description, uploadResult.secure_url, date]
    );

    res.json({ message: "News added successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
