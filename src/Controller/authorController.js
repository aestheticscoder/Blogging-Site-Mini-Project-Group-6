const Author = require("..//Models/authorModel");

// Create an author - atleast 5 authors
// Create a author document from request body.

// Create a new author
const createAuthor = async (req, res) => {
    try {
      const data = req.body;
      const createdAuthor = await Author.create(data);
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

module.exports.createAuthor = createAuthor
module.exports.getAllAuthors = getAllAuthors
