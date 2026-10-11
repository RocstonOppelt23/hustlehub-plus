// Creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD in .env
// Run once with: npm run seed:admin
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

async function seed() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first');
  }

  await connectDB();
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log('Admin already exists:', existing.email);
  } else {
    await User.create({ name: 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
    console.log('Admin created:', ADMIN_EMAIL);
  }
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
