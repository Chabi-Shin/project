const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'PROGRESS', 'TESTING', 'DONE'], default: 'OPEN' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References to the user who created the todo
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
