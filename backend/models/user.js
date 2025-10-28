const mongoose = require('mongoose');

// Define schema (structure of a user document)
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  accountNumber: { type: String, unique: true, required: true },
  accountType: { type: String, enum: ["savings", "checking"], default: "savings" },
  balance: { type: Number, default: 0 },
  investments: { type: Number, default: 0 },  // new field
  createdAt: { type: Date, default: Date.now },
});

// Create model from schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
