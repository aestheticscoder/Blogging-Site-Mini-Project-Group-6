const Blog = require("../Models/blogModel");
const Author = require("../Models/authorModel");
const mongoose = require("mongoose");

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, body, authorId, tags, category, subcategory } = req.body;

    //is authorId valid
    const check = mongoose.isValidObjectId(authorId);
    if (!check) {
      return res.status(400).json({
        status: false,
        message: "invalid authorId",
      });
    }

    // Check if the authorId exists
    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(400).json({
        status: false,
        message: "invalid authorId",
      });
    }

    const blog = new Blog({
      title,
      body,
      authorId,
      tags,
      category,
      subcategory,
    });

    const createdBlog = await blog.save();
    res.status(201).json({ status: true, data: createdBlog });
  } catch (error) {
    res.status(400).json({ status:false, message: error.message });
  }
};

// Get all blogs
// const getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find({ isDeleted: false, isPublished: true });
//     res.status(200).json({status :true, message : "Blogs list" , data : blogs});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get blogs with filters
const getAllBlogs = async (req, res) => {
  try {   //problem   
    const { authorId, category, tags } = req.query;

    const filters = {};

    if (authorId) {
      filters.authorId = authorId;
    }

    if (category) {
      filters.category = category;
    }

    if (tags) {
      filters.tags = { $in: tags.split(",") };
    }

    const blogs = await Blog.find({
      ...filters,
      isDeleted: false,
      isPublished: true,
    });
    res.status(200).json({status : true, message : "Blogs list", data : blogs});
  } catch (error) {
    res.status(500).json({ status : false , message: error.message });
  }
};

// Update a blog
const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, body, tags, subcategory, isPublished } = req.body;
         //   is valid blogId
         const check = mongoose.isValidObjectId(blogId);
         if (!check) {
           return res.status(400).json({
             status: false,
             message: "invalid blogId",
           });
         }
    // Check if the blogId exists and is not deleted
    const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    blog.title = title;
    blog.body = body;
    blog.tags = tags ? [...blog.tags, ...tags] : blog.tags;
    blog.subcategory = subcategory
      ? [...blog.subcategory, ...subcategory]
      : blog.subcategory;
    blog.isPublished = isPublished || blog.isPublished;
  

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ status : false , message: error.message });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Check if the blogId exists and is not deleted
    const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
    if (!blog) {
      return res.status(404).json({ status : false , message: "Blog not found" });
    }

    blog.isDeleted = true;
    blog.deletedAt = new Date();

    await blog.save();
    res.status(200).end();
  } catch (error) {
    res.status(400).json({status:false , message : error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
};
