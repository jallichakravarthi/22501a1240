const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  shortcode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 30 * 60 * 1000),
  },
  clicks: {
    type: Number,
    default: 0,
  },
  clickDetails: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      referrer: {
        type: String,
        default: 'Direct',
      },
      location: {
        type: String,
        default: 'Unknown',
      },
    }
  ],
});

module.exports = mongoose.model('Url', urlSchema);
