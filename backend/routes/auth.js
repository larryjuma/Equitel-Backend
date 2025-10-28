const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user'); // our User model

// Function to generate a random 10-digit account number
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// ------------------- GET ROUTES ------------------- //
// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Register page
router.get('/register', (req, res) => {
  res.render('register');
});

// ------------------- POST ROUTES ------------------- //
// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, accountType } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      fullName,
      email,
      password: hashedPassword,
      accountType: accountType || 'savings',
      accountNumber: generateAccountNumber(),
    });

    await user.save();

    // Redirect to dashboard after signup
    res.redirect(`/dashboard/${user._id}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('❌ Server Error');
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('❌ Invalid credentials');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('❌ Invalid credentials');
    }

    // Login success — redirect to dashboard
    res.redirect(`/dashboard/${user._id}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('❌ Server Error');
  }
});

module.exports = router;
