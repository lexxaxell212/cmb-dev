require('dotenv').config();

const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

/**
 * Membuat admin pertama dari variabel lingkungan ADMIN_USERNAME + ADMIN_PASSWORD.
 * Hanya berjalan jika username tersebut belum ada di MongoDB.
 * Tidak perlu diedit manual — biarkan kode yang mengelola data auth.
 */
async function ensureAdminFromEnv() {
  const username = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';

  if (!username || !password) {
    return { created: false, reason: 'ADMIN_USERNAME/ADMIN_PASSWORD belum diisi di .env' };
  }

  const existing = await Admin.findOne({ username });
  if (existing) {
    return { created: false, reason: 'admin sudah ada', username };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ username, passwordHash });
  return { created: true, username };
}

module.exports = { ensureAdminFromEnv };