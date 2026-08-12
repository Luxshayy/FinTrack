const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const supportedCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY'];

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userResponse = (user) => ({
  token: createToken(user._id),
  user: { id: user._id, name: user.name, email: user.email, currency: user.currency || 'USD' },
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, currency = 'USD' } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (!supportedCurrencies.includes(currency)) {
      return res.status(400).json({ message: 'Please select a supported currency.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: passwordHash, currency });
    return res.status(201).json(userResponse(user));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create your account.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    const passwordMatches = user && await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json(userResponse(user));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log you in.' });
  }
});

module.exports = router;
