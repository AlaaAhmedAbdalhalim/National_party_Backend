const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// GET all Messages
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ContactMessages");
    res.status(200).json(rows);
  } catch (error) {
    console.error("GET Events Error:", error);
    res.status(500).json({ message: "Failed to fetch Messages" });
  }
});

// POST new Messages
router.post("/", async (req, res) => {
  try {
    const { FullName, Email, Phone, Message  } = req.body;

    // Validation
    if (!FullName || !Email || !Phone || !Message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    // Insert into DB
    await db.query(
      `INSERT INTO ContactMessages 
        (FullName, Email, Phone, Message)
        VALUES (?, ?, ?, ?)`,
      [FullName, Email, Phone, Message]
    );

    res.status(201).json({ message: "Messages added successfully" });
  } catch (error) {
    console.error("POST Messages Error:", error); // هيطبع كل التفاصيل
    res.status(500).json({ message: "Failed to add Messages" });
  }
});



module.exports = router;
