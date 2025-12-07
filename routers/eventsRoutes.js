// استدعاء المكتبات الأساسية
const express = require('express');
const router = express.Router();
const path = require('path');           
const multer = require('multer');       
const { sql, poolPromise } = require('../config/db');

// === إعدادات Multer ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // تأكدي إن الفولدر موجود
  },
filename: (req, file, cb) => {
  const newName = Date.now() + '-' + file.originalname;
  cb(null, newName);
}

});
const upload = multer({ storage: storage });

// === Routes ===

// GET جميع الأحداث
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Events');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching Events:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST إضافة حدث جديد
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, location } = req.body;

    // التحقق من الحقول الأساسية
    if (!title || !description || !location) {
      return res.status(400).json({ error: 'Title, description, and location are required.' });
    }

    // استخدام صورة افتراضية لو مش موجودة
    const image = req.file ? req.file.filename : 'default.png';
    const date = new Date();

    const pool = await poolPromise;
    await pool.request()
      .input('Title', sql.NVarChar, title)
      .input('Description', sql.NVarChar, description)
      .input('Image', sql.NVarChar, image)
      .input('Date', sql.DateTime, date)
      .input('Location', sql.NVarChar, location)
      .query(`INSERT INTO Events (Title, Description, Image, Date, Location) 
              VALUES (@Title, @Description, @Image, @Date, @Location)`);

    res.status(201).json({ message: 'Event added successfully', image });
  } catch (err) {
    console.error('Error adding Event:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
