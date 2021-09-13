const mongoose = require('mongoose');

const BloodBankSchema = new mongoose.Schema({
  bloodbank_name: {
    type: String,
  },
  images: String,
  disc: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  blood: [{ group: String, value: Number }],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BloodBank', BloodBankSchema);
