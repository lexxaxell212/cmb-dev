require('dotenv').config();

const bcrypt = require('bcryptjs');
const { connectDB } = require('./db');
const Admin = require('./models/Admin');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/egycoffee';

async function main() {
  if (process.argv.length < 4) {
    console.error('Gunakan: npm run add-admin -- <username> <password>');
    process.exit(1);
  }

  const username = String(process.argv[2]).trim().toLowerCase();
  const password = process.argv[3];

  if (!username || password.length < 8) {
    console.error('Username wajib diisi dan password minimal 8 karakter.');
    process.exit(1);
  }

  await connectDB(MONGO_URI);

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.error(`Admin '${username}' sudah ada.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ username, passwordHash });
  console.log(`Admin '${username}' berhasil dibuat.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Gagal membuat admin:', err.message);
  process.exit(1);
});