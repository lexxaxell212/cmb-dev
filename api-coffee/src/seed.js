require('dotenv').config();

const { connectDB } = require('./db');
const Product = require('./models/Product');
const News = require('./models/News');
const Setting = require('./models/Setting');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/egycoffee';

async function seed() {
  await connectDB(MONGO_URI);

  const products = require('./data/products.json');
  const news = require('./data/news.json');
  const settings = require('./data/settings.json');

  await Promise.all([
    Product.deleteMany({}),
    News.deleteMany({}),
    Setting.deleteMany({}),
  ]);

  await Product.insertMany(products);
  await News.insertMany(news);
  await Setting.create({ key: 'shop', ...settings });

  console.log(`Seeded: ${products.length} products, ${news.length} news, 1 settings`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});