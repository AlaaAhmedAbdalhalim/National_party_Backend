const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");

// GET events
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Events");
  res.json(rows);
});

// POST event
router.post("/", async (req, res) => {
  const { title, description, image, date, location } = req.body;

  const upload = await cloudinary.uploader.upload(image);

  await db.query(
    "INSERT INTO Events (Title, Description, Image, Date, Location) VALUES (?, ?, ?, ?, ?)",
    [title, description, upload.secure_url, date, location]
  );

  res.json({ message: "Event added" });
});

module.exports = router;
