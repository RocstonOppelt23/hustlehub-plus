const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Colby: helmet + CSP, sanitisation and rate limiting plug in here
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
// Ethan: app.use('/api/gigs', gigRoutes); app.use('/api/bookings', bookingRoutes); etc.

// Unknown routes
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Fallback error handler (Colby can replace with the central one)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  return res.status(status).json({ message: status >= 500 ? 'Something went wrong' : err.message });
});

module.exports = app;
