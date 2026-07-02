require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const User = require('./models/User');
const Business = require('./models/Business');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log('Clearing old data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Business.deleteMany({});
    await User.deleteMany({ email: 'seller@example.com' });

    console.log('Reading MASSIVE seed data from JSON...');
    const dataPath = __dirname + '/seedDataMassive.json';
    const rawData = fs.readFileSync(dataPath);
    const seedJson = JSON.parse(rawData);

    console.log('Creating users...');
    const createdUsers = {};
    for (const u of seedJson.users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const user = new User({
        name: u.name,
        email: u.email,
        password: hashedPassword
      });
      await user.save();
      createdUsers[u.id] = user._id; // Map custom ref to real MongoDB ID
    }

    console.log('Creating businesses...');
    const createdBusinesses = {};
    for (const biz of seedJson.businesses) {
      const b = new Business({
        owner_id: createdUsers[biz.owner_id_ref],
        name: biz.name,
        slug: biz.slug,
        category: biz.category,
        description: biz.description,
        location: biz.location,
        phone: biz.phone,
        currency: biz.currency
      });
      await b.save();
      createdBusinesses[biz.slug] = b._id;
    }

    console.log('Creating products (this might take a moment)...');
    const allProducts = [];
    for (const [slug, productsArray] of Object.entries(seedJson.products)) {
      const bizId = createdBusinesses[slug];
      if (!bizId) continue;
      
      for (const prod of productsArray) {
        allProducts.push({
          business_id: bizId,
          name: prod.name,
          description: prod.description,
          price: prod.price,
          image_url: prod.image_url,
          in_stock: prod.in_stock,
          discount: prod.discount,
          min_qty: prod.min_order,
          max_qty: prod.max_order,
          is_promotion: prod.is_promotion
        });
      }
    }

    // Insert in batches of 500 to prevent memory issues with massive datasets
    const batchSize = 500;
    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`Inserted ${Math.min(i + batchSize, allProducts.length)} / ${allProducts.length} products`);
    }

    console.log('Massive seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedData();
