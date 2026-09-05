const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const newsRouter = require('./routes/news');
const settingsRouter = require('./routes/settings');

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.includes('*') ? '*' : corsOrigins,
  })
);
app.use(express.json({ limit: '1mb' }));

// Middleware penjaga: semua route /api (selain health & auth/login)
// wajib menyertakan header: Authorization: Bearer <token JWT>
function requireAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);

app.use('/api/products', requireAuth, productsRouter);
app.use('/api/news', requireAuth, newsRouter);
app.use('/api/settings', requireAuth, settingsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;