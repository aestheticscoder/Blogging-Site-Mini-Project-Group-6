const jwt = require("jsonwebtoken");
const authorModel= require('../Models/authorModel')

const authMiddleware = async (req, res, next) => {
  try {
  const token = req.headers["x-api-key"];
  if (!token) {
  return res.status(401).json({ error: "Access denied. Token missing." });
  }

  const decoded = jwt.verify(token, "group6priyankaravinarottamvishal");
  if (!decoded) return res.status(401)
  .json({status: false, msg: "token is invalid"})

  const authorId= await authorModel.findById(decoded.authorId)
  if(!authorId) return res.status(401)
  .json({status: false, msg: "author not login"})

  req["x-api-key"] = decoded
  next();
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
};

module.exports = {authMiddleware};
