const express = require("express");
const router = express.Router();
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// GET all JoinUs forms
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM JoinUs");
    res.status(200).json(rows);
  } catch (error) {
    console.error("GET JoinUs Forms Error:", error);
    res.status(500).json({ message: "Failed to fetch JoinUs Forms" });
  }
});

// POST a new JoinUs form
router.post("/", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

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

    // Validation (حذفنا الحقول الاختيارية من الشرط)
    if (
      !FullName ||
      !BirthDate ||
      !Gender ||
      !MaritalStatus ||
      !Address ||
      !Governorate ||
      !Phone ||
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

    // Upload images to Cloudinary
    const idFrontUpload = await cloudinary.uploader.upload(IdFrontImage, { folder: "JoinUs/idFront" });
    const idBackUpload = await cloudinary.uploader.upload(IdBackImage, { folder: "JoinUs/idBack" });
    const personalPhotoUpload = await cloudinary.uploader.upload(PersonalPhoto, { folder: "JoinUs/personalPhoto" });

    // Insert into DB
    const query = `
      INSERT INTO JoinUs
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
      PartyUnit || null,
      Governorate,
      District || null,
      Phone,
      Email || null,
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
      PreviousParty || null,
      ParliamentMember || null,
      UnionMembership || null,
      Awards || null
    ];

    await db.query(query, values);

    res.status(201).json({ message: "JoinUs form added successfully" });

  } catch (error) {
    console.error("POST JoinUs Form Error:", error);
    res.status(500).json({ message: "Failed to add JoinUs form" });
  }
});

module.exports = router;
