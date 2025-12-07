// routers/newsRoutes.js


const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { sql, poolPromise } = require('../config/db');
// ========================================
// GET all news
// ========================================
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM News');
        res.json(result.recordset); // هيرجع لك array من الأخبار
    } catch (err) {
        console.error('Error fetching news:', err);
        res.status(500).json({ error: err.message });
    }
});
// إعداد فولدر التخزين واسم الملف
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // تأكدي إن الفولدر موجود
  },
  filename: (req, file, cb) => {
  const newName = Date.now() + '-' + file.originalname;
  cb(null, newName);
}

});

const upload = multer({ storage: storage });

// POST إضافة خبر مع الصورة
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const date = new Date();

    const pool = await poolPromise;
    await pool.request()
      .input('Title', sql.NVarChar, title)
      .input('Description', sql.NVarChar, description)
      .input('Image', sql.NVarChar, image || '')
      .input('Date', sql.DateTime, date)
      .query('INSERT INTO News (Title, Description, Image, Date) VALUES (@Title, @Description, @Image, @Date)');

    res.status(201).json({ message: 'News added successfully', image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
