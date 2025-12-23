const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

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

router.put('/:id', auth, isAdmin, async (req, res) => {
  const eventId = req.params.id;
  const { Title, Description, Image , Date } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM Events WHERE id = ?', [eventId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Events not found' });
    }

    let imageUrl = rows[0].Image; // Default old image

    // لو صورة جديدة مرفوعة Base64
    if (Image && Image.startsWith('data:image')) {
      // رفع على Cloudinary
      const upload = await cloudinary.uploader.upload(Image, {
        folder: 'events'
      });
      imageUrl = upload.secure_url;
    }

    // تحديث DB
    await db.query(
      'UPDATE Events SET Title = ?, Description = ?, Image = ?, Date = ? WHERE id = ?',
      [Title, Description, imageUrl, Date, eventId]
    );

    res.status(200).json({ message: 'Events updated successfully' });
  } catch (error) {
    console.error('Update events error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});



router.delete('/:id', auth, isAdmin, async (req, res) => {
  const events = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM Events WHERE id = ?', [events]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Events not found' });
    }

    await db.query('DELETE FROM Events WHERE id = ?', [events]);

    res.status(200).json({ message: 'Events deleted successfully' });
  } catch (error) {
    console.error('Delete events error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

module.exports = router;
