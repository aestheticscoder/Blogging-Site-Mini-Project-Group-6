const Blog = require("../Models/blogModel");
const Author = require("../Models/authorModel");
const mongoose = require("mongoose");





const createBlog = async (req, res) => {
  try {
    const data = req.body;
      // console.log(data.authorId)

      if(data.authorId!=req.access_token.authorId)  return res.status(403).send({status : false , message : "unauthorized"})
      
    // Check if the authorId exists or not
    const author = await Author.findById(data.authorId)
    if (!author) {
      return res.status(400).json({
        status: false,
        message: "author with this id doesn't exists",
      });
    }

    const createdBlog = await Blog.create(data);
    res.status(201).json({ status: true, data: createdBlog });
  } catch (error) {
    res.status(400).json({ status:false, message: error.message });
  }
};





////---------------------------------------/////



const getAllBlogs = async (req, res) => {
  try {
    const { authorId, category, tags, subcategory } = req.query;
    const filters = { isDeleted: false, isPublished: true };

    if (authorId) {
      filters.authorId = authorId;
    }

    if (category) {
      filters.category = category;
    }

    if (tags) {
      filters.tags = { $in: tags.split(",") };
    }

    if (subcategory) {
      filters.subcategory = { $in: subcategory.split(",") };
    }

    const blogs = await Blog.find(filters);

    if (blogs.length === 0) {
      res.status(404).json({ status: false, message: "No blogs found" });
      return;
    }

    res.status(200).json({ status: true, message: "Blogs list", data: blogs });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




////----------------------------------------///
const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Check if the blogId is valid
    const isValidId = mongoose.isValidObjectId(blogId);
    if (!isValidId) {
      return res.status(400).json({ status: false, message: "Invalid blogId" });
    }

    const { title, body, tags, subcategory } = req.body;

    // Check if the blog exists and is not deleted
    const blog = await Blog.findOne({ _id: blogId, isDeleted: false });

    if (!blog) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }
    // const decoded = jwt.verify(token, "group6priyankaravinarottamvishal");
      if(req.access_token.authorId!=blog.authorId) return res.status(403).send({status:false , message: "unauthorized"})

    blog.title = title || blog.title;
    blog.body = body || blog.body;

    if (tags && tags.length > 0) {
      blog.tags.push(...tags);
    }

    if (subcategory && subcategory.length > 0) {
      blog.subcategory.push(...subcategory);
    }

    
      blog.isPublished = true;
      blog.publishedAt = new Date();

    const updatedBlog = await blog.save();
    res.status(200).json({ status: true, message: "Blog updated", data: updatedBlog });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};
////----------------------------///


const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Check if the blogId exists and is not deleted
    const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
    if (!blog) {
      return res.status(404).json({ status : false , message: "Blog not found" });
    }
    if(blog.authorId!=req.access_token.authorId)  return res.status(403).send({status : false , message : "unauthorized"})

    blog.isDeleted = true;
    blog.deletedAt = new Date();

    const deleted = await blog.save();
    res.status(200).json({
        status: true,
        message: ""
      });
  } catch (error) {
    res.status(400).json({status:false , message : error.message });
  }
};


///----------------------------------/////

const deleteBlogsByQuery = async (req, res) => {
  try {
    const queryParams = req.query;

    // Check if any query parameters are provided
    if (Object.keys(queryParams).length === 0) {
      return res.status(400).json({ status: false, message: "No query parameters provided" });
    }

    const filters = { isDeleted: false };

    // Apply filters based on the query parameters
    if (queryParams.category) {
      filters.category = queryParams.category;
    }

    if (queryParams.authorId) {
      filters.authorId = queryParams.authorId;
    }

    // if (queryParams.tag) {
    //   filters.tags = queryParams.tag;
    // }

    // if (queryParams.subcategory) {
    //   filters.subcategory = queryParams.subcategory;
    // }
    
    if (queryParams.tags) {
      filters.tags = { $in: queryParams.tags.split(",") };
    }

    if (queryParams.subcategory) {
      filters.subcategory = { $in: queryParams.subcategory.split(",") };
    }



    if (queryParams.unpublished === "true") {
      filters.isPublished = false;
    }
          // const blogs = await blog.find(filters)   //problem
    // Find and mark the matching blogs as deleted
    const result = await Blog.updateMany(filters, { isDeleted: true, deletedAt: new Date() });

    console.log(result, result.n)
    if (result.modifiedCount == 0) { // result.n means indicates the number of blogs that matched
      return res.status(404).json({ status: false, message: "No blogs found" });
    }
    

    res.status(200).json({ status: true, message: " " });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};



module.exports = {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  deleteBlogsByQuery
};
