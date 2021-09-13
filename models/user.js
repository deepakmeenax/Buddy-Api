const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  isVerify: {
    type: Boolean,
  },
  bloodGroup: {
    type: String,
  },
  age: {
    type: Number,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formattedAddress: String,
  },
  role: {
    type: String,
    default: 'user',
  },
  notifyToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
