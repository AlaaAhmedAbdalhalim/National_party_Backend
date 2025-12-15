const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");

// GET all events
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Events");
    res.status(200).json(rows);
  } catch (error) {
    console.error("GET Events Error:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// POST new event
router.post("/", async (req, res) => {
  try {
    const { title, description, image, date } = req.body;

    // Validation
    if (!title || !description || !image || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Upload image to Cloudinary
    const upload = await cloudinary.uploader.upload(image, {
      folder: "events"
    });

    // Insert into DB
    await db.query(
      `INSERT INTO Events 
       (Title, Description, Image, Date)
       VALUES (?, ?, ?, ?)`,
      [title, description, upload.secure_url, date]
    );

    res.status(201).json({ message: "Event added successfully" });
  } catch (error) {
    console.error("POST Event Error:", error);
    res.status(500).json({ message: "Failed to add event" });
  }
});

module.exports = router;
