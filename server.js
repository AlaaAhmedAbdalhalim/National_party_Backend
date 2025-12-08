/* const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Welcome to National Party API ✅');
});

// استدعاء الروترات
const newsRouter = require('./routers/newsRoutes');
 const eventsRouter = require('./routers/eventsRoutes');
const membersRouter = require('./routes/membersRoutes');
/*const membershipRouter = require('./routes/membership');
const contactRouter = require('./routes/contact'); */
/* const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/newsRoutes', newsRouter);
 app.use('/api/eventsRoutes', eventsRouter);
app.use('/api/membersRoutes', membersRouter); */
/*app.use('/api/membership', membershipRouter);
app.use('/api/contact', contactRouter); */

/* app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
 */

const express = require('express');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
const eventsRouter = require('./routes/events');
app.use('/events', eventsRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
