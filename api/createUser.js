// api/createTestUser.js
const mongoose = require('mongoose');
const User = require('./db/User');  // Adjust the path as necessary

const DB_URI = 'mongodb://localhost:27017/project';
const TEST_USER_EMAIL = 'test@example3.com';
const TEST_USER_PASSWORD = 'password123';

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createTestUser = async () => {
  try {
    const userExists = await User.findOne({ email: TEST_USER_EMAIL });
    if (!userExists) {
      const newUser = new User({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
      await newUser.save();
      console.log('Test user created successfully');
    } else {
      console.log('Test user already exists');
    }
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating user:', error);
    mongoose.connection.close();
  }
};

createTestUser();
