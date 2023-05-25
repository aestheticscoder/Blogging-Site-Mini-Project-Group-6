const express=require("express");
const router=express.Router();
const blogController = require("../Controller/blogController");
const authorController=require('../Controller/authorController');

router.post('/authors',authorController.createAuthor)
router.get('/authordetails',authorController.getAllAuthors)
module.exports=router;