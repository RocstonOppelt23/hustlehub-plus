require('dotenv').config();
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const keyPath = path.join(__dirname, '..', 'certs', 'key.pem');
const certPath = path.join(__dirname, '..', 'certs', 'cert.pem');

async function start() {
  await connectDB();

  // Use HTTPS when the local SSL certs exist (same as Part 1), otherwise plain HTTP for dev
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const options = { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
    https.createServer(options, app).listen(PORT, () => {
      console.log(`HustleHub+ API running on https://localhost:${PORT}`);
    });
  } else {
    http.createServer(app).listen(PORT, () => {
      console.log(`HustleHub+ API running on http://localhost:${PORT} (no certs found in server/certs)`);
    });
  }
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
