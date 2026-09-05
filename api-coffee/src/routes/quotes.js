const express = require('express');
const Quote = require('../models/Quote');

const router = express.Router();

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/quotes
router.get('/', async (req, res, next) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: 1 });
    res.json(quotes);
  } catch (err) {
    next(err);
  }
});

// POST /api/quotes
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const id = body.id || slugify(body.text?.id || '') || `q-${Date.now()}`;
    const existing = await Quote.findOne({ id });
    if (existing) {
      return res.status(409).json({ error: 'Quote id already exists' });
    }
    const quote = await Quote.create({
      id,
      text: body.text || { id: '', en: '' },
    });
    res.status(201).json(quote);
  } catch (err) {
    next(err);
  }
});

// PUT /api/quotes/:id
router.put('/:id', async (req, res, next) => {
  try {
    const quote = await Quote.findOneAndUpdate(
      { id: req.params.id },
      { $set: { text: req.body.text || { id: '', en: '' } } },
      { new: true, runValidators: true }
    );
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json(quote);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/quotes/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const quote = await Quote.findOneAndDelete({ id: req.params.id });
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;