require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require("multer");

const app = express(); // ✅ لازم ييجي قبل أي app.get أو app.use
console.log("ENV CHECK:", process.env.MYSQLHOST);

// DB
const pool = require("./config/db");

// Routes
const eventsRouter = require('./routes/eventsRoutes');
/* const newsRouter = require('./routes/newsRoutes');
const membersRouter = require('./routes/membersRoutes'); */

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.get("/health", async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ status: "fail", reason: "no db pool" });
    }

    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      error: err.message
    });
  }
});

/* app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS test");
    res.json(rows);
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}); */

// API Routes
app.use('/api/events', eventsRouter);
/* app.use('/api/news', newsRouter);
app.use('/api/members', membersRouter); */

// Start server
const PORT = process.env.PORT || 3000; // 3000 للتجربة محليًا فقط
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

