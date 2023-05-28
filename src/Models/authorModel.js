const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  fname: { 
    type: String,
     required: true,
    trim : true
    },
  lname: { 
    type: String,
     required: true,
    trim : true
    },
  title: { 
    type: String,
    enum: ['Mr', 'Mrs', 'Miss'],
    required: [true, "title should be given"]},
  email: {
    type: String,
    required: true,
    unique: true,
    // lowercase: true,
    validate: {
      validator: function (value) {
        // Regular expression to validate email format
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(value);
      },
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,
    trim :true
    },

},{timestamps:true});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
