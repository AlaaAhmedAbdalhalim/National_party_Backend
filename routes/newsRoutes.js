const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// GET all events
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM News");
    res.status(200).json(rows);
  } catch (error) {
    console.error("GET News Error:", error);
    res.status(500).json({ message: "Failed to fetch News" });
  }
});

// POST new event
router.post("/", async (req, res) => {
  try {
    const { Title, Description, Image, Date } = req.body;

    // Validation
    if (!Title || !Description || !Image || !Date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Upload image to Cloudinary
    const upload = await cloudinary.uploader.upload(Image, {
      folder: "news"
    });

    // Insert into DB
    await db.query(
      `INSERT INTO News 
        (Title, Description, Image, Date)
        VALUES (?, ?, ?, ?)`,
      [Title, Description, upload.secure_url, Date]
    );

    res.status(201).json({ message: "News added successfully" });
  } catch (error) {
    console.error("POST News Error:", error); // هيطبع كل التفاصيل
    res.status(500).json({ message: "Failed to add new" });
  }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  const mnewId = req.params.id;
  const { Title, Description, Image , Date } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM News WHERE id = ?', [mnewId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }

    let imageUrl = rows[0].Image; // Default old image

    // لو صورة جديدة مرفوعة Base64
    if (Image && Image.startsWith('data:image')) {
      // رفع على Cloudinary
      const upload = await cloudinary.uploader.upload(Image, {
        folder: 'news'
      });
      imageUrl = upload.secure_url;
    }

    // تحديث DB
    await db.query(
      'UPDATE News SET Title = ?, Description = ?, Image = ?, Date = ? WHERE id = ?',
      [Title, Description, imageUrl, Date, mnewId]
    );

    res.status(200).json({ message: 'News updated successfully' });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});



router.delete('/:id', auth, isAdmin, async (req, res) => {
  const news = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM News WHERE id = ?', [news]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }

    await db.query('DELETE FROM News WHERE id = ?', [news]);

    res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

module.exports = router;
