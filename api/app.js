const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Todo = require('./todo');  // Imports the Todo model
const User = require('./db/User');  // Imports the User model

const app = express();
const PORT = process.env.PORT || 8000;
const DB_URI = 'mongodb://localhost:27017/project';
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
});

// Register route
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`Received registration request for email: ${email}`);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed password before saving: ${hashedPassword}`);
    
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Retrieves the user from the database right after saving to check the saved password
    const savedUser = await User.findOne({ email });
    console.log(`Hashed password saved in database: ${savedUser.password}`);
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`Received login request for email: ${email}`);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User found: ${user.email}`);
    console.log(`Password (plain): ${password}`);
    console.log(`Password (hashed from DB): ${user.password}`);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Ensures this is correctly setting the user
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Todo routes

//todo display route
app.get('/api/todo', authenticate, async (req, res) => {
  const { status } = req.query;
  const query = { userId: req.user.userId };

  if (status) {
    query.status = status;
  }

  try {
    const todos = await Todo.find(query);
    res.status(200).json({ data: todos });
  } catch (error) {
    console.error('Fetching Todos Error:', error);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
});

//Todo adding route
app.post('/api/todo', authenticate, async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const newTodo = new Todo({
      title,
      description,
      status,
      userId: req.user.userId,
      created_at: new Date(), // Sets created_at only during creation
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Todo Creation Error:', error);
    res.status(500).json({ message: 'Failed to create todo' });
  }
});

//Todo update route
app.put('/api/todo/:id', authenticate, async (req, res) => {
  const { id } = req.params; // Extracts the id from params
  const { title, description, status } = req.body; // Extracts updated fields from request body

  try {
    console.log('Updating todo with ID:', id); // Logs the ID to debug
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user.userId }, // Ensures both _id and userId match
      { title, description, status, updated_at: new Date() }, // Sets the fields to update
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!todo) {
      console.log('Todo not found or user unauthorized');
      return res.status(404).json({ message: 'Todo not found or user unauthorized' });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error('Updating Todo Error:', error);
    res.status(500).json({ message: 'Failed to update todo' });
  }
});

// Todo delete route
app.delete('/api/todo/:id', authenticate, async (req, res) => {
  const { id } = req.params; // Extracts the id from params

  try {
    console.log('Deleting todo with ID:', id); // Logs the ID to debug
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user.userId }); // Ensures both _id and userId match

    if (!todo) {
      console.log('Todo not found or user unauthorized');
      return res.status(404).json({ message: 'Todo not found or user unauthorized' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Deleting Todo Error:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
