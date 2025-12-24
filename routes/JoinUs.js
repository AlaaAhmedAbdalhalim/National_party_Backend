const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// GET all events
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM JoinUs");
    res.status(200).json(rows);
  } catch (error) {
    console.error("GET JoinUs Forms Error:", error);
    res.status(500).json({ message: "Failed to fetch JoinUs Forms" });
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
// POST new member
router.post("/", async (req, res) => {
  try {
    const {
      FullName,
      BirthDate,
      Gender,
      MaritalStatus,
      Address,
      PartyUnit,
      Governorate,
      District,
      Phone,
      Email,
      NationalId,
      IdExpiryDate,
      IdFrontImage,
      IdBackImage,
      PersonalPhoto,
      EducationLevel,
      HigherDegree,
      JobTitle,
      JobAddress,
      WorkPlace,
      PreviousParty,
      ParliamentMember,
      UnionMembership,
      Awards
    } = req.body;

    // Validation: تأكدي كل الحقول المطلوبة موجودة
    if (
      !FullName ||
      !BirthDate ||
      !Gender ||
      !MaritalStatus ||
      !Address ||
      !PartyUnit ||
      !Governorate ||
      !District ||
      !Phone ||
      !Email ||
      !NationalId ||
      !IdExpiryDate ||
      !IdFrontImage ||
      !IdBackImage ||
      !PersonalPhoto ||
      !EducationLevel ||
      !JobTitle
    ) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Upload الصور إلى Cloudinary
    const [idFrontUpload, idBackUpload, personalPhotoUpload] = await Promise.all([
      cloudinary.uploader.upload(IdFrontImage, { folder: "members/idFront" }),
      cloudinary.uploader.upload(IdBackImage, { folder: "members/idBack" }),
      cloudinary.uploader.upload(PersonalPhoto, { folder: "members/personalPhoto" })
    ]);

    // Insert into DB
    const query = `
      INSERT INTO members 
      (FullName, BirthDate, Gender, MaritalStatus, Address, PartyUnit, Governorate, District, Phone, Email, NationalId, IdExpiryDate,
       IdFrontImage, IdBackImage, PersonalPhoto, EducationLevel, HigherDegree, JobTitle, JobAddress, WorkPlace, PreviousParty, ParliamentMember, UnionMembership, Awards)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      FullName,
      BirthDate,
      Gender,
      MaritalStatus,
      Address,
      PartyUnit,
      Governorate,
      District,
      Phone,
      Email,
      NationalId,
      IdExpiryDate,
      idFrontUpload.secure_url,
      idBackUpload.secure_url,
      personalPhotoUpload.secure_url,
      EducationLevel,
      HigherDegree || null,
      JobTitle,
      JobAddress || null,
      WorkPlace || null,
      PreviousParty || false,
      ParliamentMember || false,
      UnionMembership || null,
      Awards || null
    ];

    await db.query(query, values);
console.log(req.body);

    res.status(201).json({ message: "joinUs Form added successfully" });

  } catch (error) {
    console.error("POST JoinUs Form Error:", error);
    res.status(500).json({ message: "Failed to add joinUs Form" });
  }
});

/* 
router.put('/:id', auth, isAdmin, async (req, res) => {
  const memberId = req.params.id;
  const { Name, Position, Image } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM Members WHERE id = ?', [memberId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    let imageUrl = rows[0].Image; // Default old image

    // لو صورة جديدة مرفوعة Base64
    if (Image && Image.startsWith('data:image')) {
      // رفع على Cloudinary
      const upload = await cloudinary.uploader.upload(Image, {
        folder: 'members'
      });
      imageUrl = upload.secure_url;
    }

    // تحديث DB
    await db.query(
      'UPDATE Members SET Name = ?, Position = ?, Image = ? WHERE id = ?',
      [Name, Position, imageUrl, memberId]
    );

    res.status(200).json({ message: 'Member updated successfully' });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
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

 */
module.exports = router;
