const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// GET all events
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Members");
    res.status(200).json(rows);
  } catch (error) {
    console.error("GET Members Error:", error);
    res.status(500).json({ message: "Failed to fetch Members" });
  }
});

// POST new event
router.post("/", async (req, res) => {
  try {
    const { Name, Position, Image } = req.body;

    // Validation
    if (!Name || !Position || !Image ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Upload image to Cloudinary
    const upload = await cloudinary.uploader.upload(Image, {
      folder: "members"
    });

    // Insert into DB
    await db.query(
      `INSERT INTO Members 
        (Name, Position, Image)
        VALUES (?, ?, ?)`,
      [Name, Position,  upload.secure_url]
    );

    res.status(201).json({ message: "Member added successfully" });
  } catch (error) {
    console.error("POST Member Error:", error); // هيطبع كل التفاصيل
    res.status(500).json({ message: "Failed to add member" });
  }
});
router.delete('/:id', auth, isAdmin, async (req, res) => {
  const memberId = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM Members WHERE id = ?', [memberId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await db.query('DELETE FROM Members WHERE id = ?', [memberId]);

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});


module.exports = router;
