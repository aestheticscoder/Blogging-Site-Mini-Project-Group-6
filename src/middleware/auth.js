const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers["x-api-key"];
    if (!token) {
      return res.status(401).json({ error: "Access denied. Token missing." });
    }

    const decoded = jwt.verify(token, "group6priyankaravinarottamvishal");
    req.access_token = decoded
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token." });
  }
};

const authorize = (req,res,next)=>{
       let id = req.access_token.authorId
     if(req.params.authorId===id){
           next()  
     }else {
        return res.status(403).send({status:false, message : "Forbbiden"})
     }
     
}



module.exports.authorize = authorize

module.exports.authMiddleware = authMiddleware;
