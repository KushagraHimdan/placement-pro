const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never return password field by default in queries
    },
    role: {
      type: String,
      enum: ['student', 'tpo', 'recruiter'],
      required: true,
    },
    refreshToken: {
      type: String,
      select: false, // stores the current valid refresh token for rotation (Task 9)
    },
  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

// Hash password before saving, but only if it was changed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare a plain-text password against the hashed one
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);