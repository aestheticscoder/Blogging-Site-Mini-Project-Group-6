const Author = require("..//Models/authorModel");

// Create a new author
const createAuthor = async (req, res) => {
    try {
      const { fname, lname, title, email, password } = req.body;
      
      const author = new Author({
        fname,
        lname,
        title,
        email:email.toLowerCase(),
        password
      });
  
      const createdAuthor = await author.save();
      res.status(201).json(createdAuthor);
    } catch (error) {
      res.status(400).json({ status :false,message: error.message });
    }
  };

// Get all authors
const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ status:false , message: error.message });
  }
};

module.exports = {
  createAuthor,
  getAllAuthors,
};
