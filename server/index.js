require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDb } = require('./db');
const { adminRouter } = require('./routes/admin');
const { contentRouter } = require('./routes/content');
const { contactRouter } = require('./routes/contact');
const { mediaRouter } = require('./routes/media');
const { achievementsRouter } = require('./routes/achievements');
const { profileRouter } = require('./routes/profile');
const { partnershipRouter } = require('./routes/partnership');
const { bookingRouter } = require('./routes/booking');

const app = express();
const port = Number(process.env.PORT) || 4000;
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/admin', adminRouter);
app.use('/content', contentRouter);
app.use('/contact', contactRouter);
app.use('/media', mediaRouter);
app.use('/achievements', achievementsRouter);
app.use('/profile', profileRouter);
app.use('/partnership', partnershipRouter);
app.use('/booking', bookingRouter);

// Serve frontend static files
const frontendDistPath = path.join(__dirname, '../dist');
app.use(express.static(frontendDistPath));

// SPA: Serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });
