require('dotenv').config();

const { connectDB } = require('./db');
const Product = require('./models/Product');
const News = require('./models/News');
const Setting = require('./models/Setting');
const Quote = require('./models/Quote');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/egycoffee';

async function seed() {
  await connectDB(MONGO_URI);

  const products = require('./data/products.json');
  const news = require('./data/news.json');
  const settings = require('./data/settings.json');
  const quotes = require('./data/quotes.json');

  await Promise.all([
    Product.deleteMany({}),
    News.deleteMany({}),
    Setting.deleteMany({}),
    Quote.deleteMany({}),
  ]);

  await Product.insertMany(products);
  await News.insertMany(news);
  await Setting.create({ key: 'shop', ...settings });
  await Quote.insertMany(quotes);

  console.log(
    `Seeded: ${products.length} products, ${news.length} news, 1 settings, ${quotes.length} quotes`
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});