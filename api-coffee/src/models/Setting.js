const mongoose = require('mongoose');

const hourSchema = new mongoose.Schema(
  {
    day: { type: String, trim: true },
    time: { type: String, trim: true },
  },
  { _id: false }
);

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'shop', unique: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    instagram: { type: String, default: '' },
    shopeefood: { type: String, default: '' },
    grabfood: { type: String, default: '' },
    hours: { type: [hourSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);