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
    const { Title, Description, Image, Date , Location } = req.body;

    // Validation
    if (!Title || !Description || !Image || !Date || !Location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Upload image to Cloudinary
    const upload = await cloudinary.uploader.upload(Image, {
      folder: "events"
    });

    // Insert into DB
    await db.query(
      `INSERT INTO Events 
        (Title, Description, Image, Date ,Location)
        VALUES (?, ?, ?, ? , ?)`,
      [Title, Description, upload.secure_url, Date ,Location]
    );

    res.status(201).json({ message: "Event added successfully" });
  } catch (error) {
    console.error("POST Event Error:", error); // هيطبع كل التفاصيل
    res.status(500).json({ message: "Failed to add event" });
  }
});

module.exports = router;
