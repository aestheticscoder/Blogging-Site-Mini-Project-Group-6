const express=require("express");
const router=express.Router();
const blogController = require("../Controller/blogController");
const authorController=require('../Controller/authorController');
const middleware= require('../middleware/auth')

router.post('/authors',authorController.createAuthor)
router.get('/authordetails',authorController.getAllAuthors)
router.post("/blogs",middleware.authMiddleware, blogController.createBlog)
router.get("/blogs",middleware.authMiddleware, blogController.getAllBlogs)  
router.put("/blogs/:blogId",middleware.authMiddleware, blogController.updateBlog)
router.post('/login',authorController.loginAuthor)
router.get("/blog",middleware.authMiddleware, blogController.getAllBlogs)
router.delete("/blogs/:blogId",middleware.authMiddleware, blogController.deleteBlog)

module.exports=router;