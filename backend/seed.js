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

    console.log('Creating dummy user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const user = new User({
      name: 'John Doe (Demo Seller)',
      email: 'seller@example.com',
      password: hashedPassword
    });
    user.password = 'password123';
    await user.save();

    console.log('Reading seed data from JSON...');
    const dataPath = __dirname + '/seedData.json';
    const rawData = fs.readFileSync(dataPath);
    const seedJson = JSON.parse(rawData);

    console.log('Creating businesses...');
    const createdBusinesses = {};
    for (const biz of seedJson.businesses) {
      const b = new Business({
        owner_id: user._id,
        name: biz.name,
        slug: biz.slug,
        category: biz.category,
        description: biz.description,
        location: biz.location,
        phone: biz.phone
      });
      await b.save();
      createdBusinesses[biz.slug] = b._id;
    }

    console.log('Creating products...');
    const allProducts = [];
    for (const [slug, productsArray] of Object.entries(seedJson.products)) {
      const bizId = createdBusinesses[slug];
      if (!bizId) continue;
      
      for (const prod of productsArray) {
        allProducts.push({
          business_id: bizId,
          ...prod
        });
      }
    }

    await Product.insertMany(allProducts);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedData();
