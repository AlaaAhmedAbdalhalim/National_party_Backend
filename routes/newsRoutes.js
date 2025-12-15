const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");

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

module.exports = router;
