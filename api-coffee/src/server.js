require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./db');
const { ensureAdminFromEnv } = require('./bootstrap');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/egycoffee';

async function start() {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET wajib diisi di file .env');
    process.exit(1);
  }

  try {
    await connectDB(MONGO_URI);

    const boot = await ensureAdminFromEnv();
    if (boot.created) {
      console.log(`Admin '${boot.username}' dibuat otomatis dari .env`);
    } else if (boot.reason !== 'admin sudah ada') {
      console.log(`Bootstrap admin dilewati: ${boot.reason}`);
    }

    app.listen(PORT, HOST, () => {
      console.log(`Coffee Manual Brew API running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();