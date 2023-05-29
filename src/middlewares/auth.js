const jwt = require("jsonwebtoken");
const authorModel= require('../Models/authorModel')

const authMiddleware =  (req, res, next) => {
  try {
  const token = req.headers["x-api-key"];
  if (!token) {
  return res.status(401).json({ error: "Access denied. Token missing." });
  }

  
  jwt.verify(token, "group6priyankaravinarottamvishal", async function(err, decoded){
    if (err) {
            return res.status(401).send({ status: false, msg: "Invalid Token" });
        }
        else {       
  const authorId = await authorModel.findById(decoded.authorId)
  if(!authorId) return res.status(401)
  .json({status: false, msg: "author not login"})

  req["x-api-key"] = decoded
  next();

  }});

  } catch (error) {
  res.status(500).json({ error: error.message });
  }
};


const emailvalidation = (req,res,next)=>{
const email = req.body.email
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if(!emailRegex.test(email)){
      return  res.status(400).send({status:false , message : "invalid email please enter valid email"})
        
      }
     next()
          
 }

module.exports = {authMiddleware, emailvalidation};
