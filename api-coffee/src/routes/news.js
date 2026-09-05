const express = require('express');
const News = require('../models/News');

const router = express.Router();

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/news
router.get('/', async (req, res, next) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// POST /api/news
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const title = body.title || {};
    const existing = await News.findOne({ id: body.id || slugify(title.en || title.id || 'news') });
    if (existing) {
      return res.status(409).json({ error: 'News id already exists' });
    }
    const news = await News.create({
      id: body.id || slugify(title.en || title.id || 'news'),
      title,
      date: body.date || new Date().toISOString().slice(0, 10),
      category: body.category || { id: '', en: '' },
      excerpt: body.excerpt || { id: '', en: '' },
      content: body.content || { id: [], en: [] },
      image: body.image || '',
    });
    res.status(201).json(news);
  } catch (err) {
    next(err);
  }
});

// PUT /api/news/:id
router.put('/:id', async (req, res, next) => {
  try {
    const body = req.body;
    const news = await News.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          title: body.title || {},
          date: body.date || '',
          category: body.category || { id: '', en: '' },
          excerpt: body.excerpt || { id: '', en: '' },
          content: body.content || { id: [], en: [] },
          image: body.image || '',
        },
      },
      { new: true, runValidators: true }
    );
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/news/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const news = await News.findOneAndDelete({ id: req.params.id });
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;