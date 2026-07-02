const fs = require('fs');

const users = Array.from({ length: 8 }, (_, i) => ({
  name: `Demo User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  password: 'password123',
  id: `user_${i}`
}));

const categories = ["Electronics & Tech", "Fashion & Apparel", "Home & Garden", "Real-Estate", "Health & Beauty", "Automotive"];
const locations = ["New York, USA", "London, UK", "Paris, France", "Tokyo, Japan", "Douala, CMR", "Lagos, NGR"];
const currencies = ["USD", "FCFA", "EUR"];

const businesses = [];
const products = {};

let b_id = 0;
users.forEach(user => {
  // 3 stores per user
  for (let i = 0; i < 3; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const cur = currencies[Math.floor(Math.random() * currencies.length)];
    const slug = `store-${b_id}-${user.id}`;
    
    businesses.push({
      owner_id_ref: user.id, // custom ref to link later
      name: `${user.name}'s ${cat.split(' ')[0]} Store`,
      slug: slug,
      category: cat,
      description: `Welcome to the best ${cat} store in ${loc}. We offer premium products.`,
      location: loc,
      phone: `+1555000${Math.floor(Math.random() * 9000) + 1000}`,
      currency: cur
    });

    products[slug] = [];
    // 50 products per store
    for (let p = 0; p < 50; p++) {
      products[slug].push({
        name: `Premium ${cat.split(' ')[0]} Product ${p + 1}`,
        description: `This is a high quality product for your needs. Carefully crafted and selected.`,
        price: Math.floor(Math.random() * 1000) + 10,
        image_url: `https://picsum.photos/seed/${slug}-${p}/600/600`,
        in_stock: true,
        discount: Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 5 : 0,
        min_order: 1,
        max_order: Math.floor(Math.random() * 100) + 10,
        is_promotion: Math.random() > 0.9
      });
    }
    b_id++;
  }
});

const seedData = { users, businesses, products };
fs.writeFileSync(__dirname + '/seedDataMassive.json', JSON.stringify(seedData, null, 2));
console.log('Massive seed data generated! Users: 8, Businesses: 24, Products: 1200');
