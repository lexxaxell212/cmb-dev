const mongoose = require('mongoose');

const localizedTextSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    en: { type: String, default: '' },
  },
  { _id: false }
);

const quoteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    text: { type: localizedTextSchema, default: () => ({ id: '', en: '' }) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);