const express = require('express');
const { register, login, me } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Colby: add the login/register rate limiters in front of these two routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);

module.exports = router;
