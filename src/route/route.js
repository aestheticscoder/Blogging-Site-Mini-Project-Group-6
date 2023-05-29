const express=require("express");
const router=express.Router();
const blogController = require("../Controller/blogController");
const authorController=require('../Controller/authorController');
const middleware= require('../middlewares/auth')

router.post('/authors',middleware.emailvalidation, authorController.createAuthor)
router.get('/authordetails',authorController.getAllAuthors)
router.post('/login', authorController.loginAuthor)

router.post("/blogs", middleware.authMiddleware, blogController.createBlog)
router.get("/blogs", middleware.authMiddleware, blogController.getAllBlogs)  
router.put("/blogs/:blogId", middleware.authMiddleware, blogController.updateBlog)
router.delete("/blogs/:blogId", middleware.authMiddleware, blogController.deleteBlog)
router.delete("/blogs", middleware.authMiddleware, blogController.deleteBlogsByQuery)
module.exports=router;