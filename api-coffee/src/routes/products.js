const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const existing = await Product.findOne({ id: body.id || slugify(body.name) });
    if (existing) {
      return res.status(409).json({ error: 'Product id already exists' });
    }
    const product = await Product.create({
      id: body.id || slugify(body.name),
      name: body.name,
      category: body.category,
      price: Number(body.price) || 0,
      currency: body.currency || 'IDR',
      image: body.image || '',
      description: body.description || { id: '', en: '' },
      tags: Array.isArray(body.tags) ? body.tags : [],
      isBestSeller: Boolean(body.isBestSeller),
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res, next) => {
  try {
    const body = req.body;
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          name: body.name,
          category: body.category,
          price: Number(body.price) || 0,
          currency: body.currency || 'IDR',
          image: body.image || '',
          description: body.description || { id: '', en: '' },
          tags: Array.isArray(body.tags) ? body.tags : [],
          isBestSeller: Boolean(body.isBestSeller),
        },
      },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;