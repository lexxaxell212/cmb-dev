const express = require('express');
const Setting = require('../models/Setting');

const router = express.Router();

// GET /api/settings — data kontak/alamat/jam buka kedai
router.get('/', async (req, res, next) => {
  try {
    let settings = await Setting.findOne({ key: 'shop' });
    if (!settings) {
      settings = await Setting.create({ key: 'shop' });
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings — perbarui semua field kontak
router.put('/', async (req, res, next) => {
  try {
    const body = req.body;
    const settings = await Setting.findOneAndUpdate(
      { key: 'shop' },
      {
        $set: {
          address: body.address || '',
          phone: body.phone || '',
          email: body.email || '',
          whatsapp: body.whatsapp || '',
          instagram: body.instagram || '',
          hours: Array.isArray(body.hours)
            ? body.hours.filter((h) => h && h.day && h.time)
            : [],
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

module.exports = router;