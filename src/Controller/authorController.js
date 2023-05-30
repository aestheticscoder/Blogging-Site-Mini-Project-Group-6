const authorModel= require('../Models/authorModel')
const jwt = require('jsonwebtoken')
const blogModel = require('../Models/blogModel')
const {isValid} = require('../middlewares/validation')
// Create a new author
const createAuthor = async (req, res) => {
  try {
  let { fname, lname, title, email, password } = req.body;

     title =  title.trim()
   const vab = ['Mr', 'Mrs', 'Miss']
  if(!vab.includes(title)) return res.status(400).send({status : false , message : "Please provide valid title from these :-'Mr', 'Mrs', 'Miss'"})

//   if(password.length<6||password.length>15){
//     return res.status(400).json({message:"Please provide strong password"});
// }

  email = email.toLowerCase()
     


  const author = new authorModel({
  fname,
  lname,
  title,
  email,
  password
  });

  const createdAuthor = await author.save();
  res.status(201).json({status : true, message : "author created" , data : createdAuthor});
  } catch (error) {
  res.status(500).json({ 
  status: false, message: error.message })
  }
};

// ******************************************************************************* //

const loginAuthor= async (req, res) => {
  try{
  let data = req.body
  if(!data.email ||!data.password) 
  return res.status(400).send({
  status :false, message : "email & password must be needed"})

  let authorEmail= data.email
  let password= data.password
 
  let author= await authorModel.findOne({
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
 
  res.setHeader("x-api-key", token)
  res.status(200).json({status: true, data: {token : token}})
 }catch (err) {
res.status(500).send({
status : false, message : err.message})
}
 }

// ******************************************************************************* //

// Get all authors  :- for testing purpose
const getAllAuthors = async (req, res) => {
try {
const authors = await authorModel.find();   
// const updating = await blogModel.updateMany({isDeleted : true},{$set : {isDeleted : false , isPublished : true}} )    
// console.log(updating.modifiedCount)    // for making things easy 
res.status(200).json(authors);
} catch (error) {
res.status(500).json({ status:false , message: error.message });
}
};

module.exports= {
createAuthor, 
loginAuthor, 
getAllAuthors}