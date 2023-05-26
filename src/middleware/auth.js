
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["x-api-key"];
  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, "group6priyankaravinarottamvishal");
    req.params.authorId = decoded.authorId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token." });
  }
};



module.exports.authMiddleware = authMiddleware;




