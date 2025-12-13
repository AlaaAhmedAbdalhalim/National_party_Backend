require('dotenv').config(); 
const express = require('express');
const cloudinary = require("./config/cloudinary");
const multer = require("multer");
const sql = require("mssql");
const dbConfig = require("./config/db");
const cors = require("cors");
const app = express();
// Routes
const eventsRouter = require('./routes/eventsRoutes');
const newsRouter = require('./routes/newsRoutes');
const membersRouter = require('./routes/membersRoutes');

// Middleware
app.use(cors({
    origin:'*'
}));
app.use(express.json());


app.use('/api/events', eventsRouter);
app.use('/api/news', newsRouter);
app.use('/api/members', membersRouter); 




// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
