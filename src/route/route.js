const express=require("express");
const router=express.Router();
const blogController = require("../Controller/blogController");
const authorController=require('../Controller/authorController');

router.post('/authors',authorController.createAuthor)
router.get('/authordetails',authorController.getAllAuthors)
router.post("/blogs", blogController.createBlog)
router.get("/allblogs", blogController.getAllBlogs)  
router.put("/blogs/:blogId", blogController.updateBlog)
router.delete("/blogs/:blogId", blogController.deleteBlog)
module.exports=router;