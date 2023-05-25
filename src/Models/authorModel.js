// { fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }

const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  title: { type: String, enum: ['Mr', 'Mrs', 'Miss'], required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Regular expression to validate email format
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(value);
      },
      message: 'Invalid email address',
    },
  },
  password: { type: String, required: true },
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
