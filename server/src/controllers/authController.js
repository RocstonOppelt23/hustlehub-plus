const User = require('../models/User');
const { SELF_REGISTER_ROLES } = require('../models/User');
const { signToken } = require('../utils/jwt');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password, role } = req.body || {};

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  // Nobody can make themselves an admin through the sign-up form
  const chosenRole = role === undefined ? 'client' : role;
  if (!SELF_REGISTER_ROLES.includes(chosenRole)) {
    return res.status(400).json({ message: 'Role must be client or freelancer' });
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const user = await User.create({ name, email, password, role: chosenRole });
  const token = signToken(user);

  return res.status(201).json({ token, user });
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  // Same message for "no user" and "wrong password" so attackers can't find valid emails
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user);
  return res.json({ token, user });
}

// GET /api/auth/me
async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json({ user });
}

module.exports = { register, login, me };
