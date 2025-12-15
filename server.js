require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require("multer");

const app = express(); // ✅ لازم ييجي قبل أي app.get أو app.use
console.log("ENV CHECK:", process.env.MYSQLHOST);

// DB
const pool = require("./config/db");
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
const eventsRouter = require('./routes/eventsRoutes');
/* const newsRouter = require('./routes/newsRoutes');
const membersRouter = require('./routes/membersRoutes'); */

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());




// API Routes
app.use(express.json());
app.use('/api/events', eventsRouter);
/* app.use('/api/news', newsRouter);
app.use('/api/members', membersRouter); */

// Start server
const PORT = process.env.MYSQLPORT || 8080; // 3000 للتجربة محليًا فقط
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

