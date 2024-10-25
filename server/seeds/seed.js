const db = require('../config/connection');
const { User } = require('../models');
const userData = require('./userData.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    // Clean the User collection
    await cleanDB('User', 'users');

    // Insert seed user data
    await User.insertMany(userData);

    console.log('Seed complete!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    // Close the database connection
    process.exit(0);
  }
});