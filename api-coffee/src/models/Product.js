const mongoose = require('mongoose');

const localizedTextSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    en: { type: String, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['coffee', 'non-coffee', 'pastry'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'IDR', trim: true },
    image: { type: String, default: '' },
    description: { type: localizedTextSchema, default: () => ({ id: '', en: '' }) },
    tags: { type: [String], default: [] },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);