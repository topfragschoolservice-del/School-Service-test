const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    accountId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['parent', 'driver', 'admin'],
      required: true,
    },
    driverProfile: {
      licenseNumber: String,
      vehicleNumber: String,
      experience: Number,
    },
    parentProfile: {
      childName: String,
      childGrade: String,
      pickupPoint: String,
      dropoffPoint: String,
    },
    adminProfile: {
      accessLevel: {
        type: String,
        default: 'transport-admin',
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidate) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
