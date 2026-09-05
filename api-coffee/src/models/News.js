const mongoose = require('mongoose');

const localizedTextSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    en: { type: String, default: '' },
  },
  { _id: false }
);

const localizedParagraphsSchema = new mongoose.Schema(
  {
    id: { type: [String], default: [] },
    en: { type: [String], default: [] },
  },
  { _id: false }
);

const newsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: localizedTextSchema, default: () => ({ id: '', en: '' }) },
    date: { type: String, default: '' },
    category: { type: localizedTextSchema, default: () => ({ id: '', en: '' }) },
    excerpt: { type: localizedTextSchema, default: () => ({ id: '', en: '' }) },
    content: {
      type: localizedParagraphsSchema,
      default: () => ({ id: [], en: [] }),
    },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', newsSchema);