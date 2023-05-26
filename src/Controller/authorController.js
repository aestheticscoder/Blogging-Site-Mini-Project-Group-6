const Author = require("..//Models/authorModel");
const jwt = require('jsonwebtoken')
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


const loginAuthor= async (req, res) => {
 try{
        let data = req.body
        if(!data) return res.status(400).send({status :false, message : "invalid email or password"})
  let authorEmail= data.email
  let password= data.password

  let author= await Author.findOne({
    email: authorEmail, password: password
  })

  if(!author) return res.status(401).json({
    status: false, msg: "email and password is not correct"
  })

  //login successful
  let token= jwt.sign(
    {
      authorId: author._id.toString(),
      group: "group6",
      project: "blogging"
    },
    "group6priyankaravinarottamvishal"
  )

  res.setHeader("x-auth-token", token)
  res.status(200).json({status: true, data: token})
}catch(err){res.status(500).send({status : false, message : err.message})}
}



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
  loginAuthor,
  getAllAuthors,
};
