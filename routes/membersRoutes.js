const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");

// GET members
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Members");
  res.json(rows);
});

// POST member
router.post("/", async (req, res) => {
  const { name, position, image } = req.body;

  const upload = await cloudinary.uploader.upload(image);

  await db.query(
    "INSERT INTO Members (Name, Position, Image) VALUES (?, ?, ?)",
    [name, position, upload.secure_url]
  );

  res.json({ message: "Member added" });
});

module.exports = router;
