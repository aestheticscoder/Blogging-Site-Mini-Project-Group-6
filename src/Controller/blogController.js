const Blog = require("../Models/blogModel");
const Author = require("../Models/authorModel");
const mongoose = require("mongoose");

// ### POST /blogs
// - Create a blog document from request body. Get authorId in request body only.
// - Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
// - Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like [this](#Blogs) 
// - Create atleast 5 blogs for each author

// - Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const data = req.body;

    // Check if the authorId exists or not
    const author = await Author.findById(data.authorId)
    if (!author) {
      return res.status(400).json({
        status: false,
        message: "invalid authorId",
      });
    }

    const createdBlog = await Blog.create(data);
    res.status(201).json({ status: true, data: createdBlog });
  } catch (error) {
    res.status(400).json({ status:false, message: error.message });
  }
};


// ### GET /blogs
// - Returns all blogs in the collection that aren't deleted and are published
// - Return the HTTP status 200 if any documents are found. The response structure should be like [this](#Get-Blogs-Response-Structure) 
// - If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 
// - Filter blogs list by applying filters. Query param can have any combination of below filters.
//   - By author Id
//   - By category
//   - List of blogs that have a specific tag
//   - List of blogs that have a specific subcategory
// example of a query url: blogs?filtername=filtervalue&f2=fv2

// Get blogs with filters
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

  
// ### PUT /blogs/:blogId
// - Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// - Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
// - Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
// - Return an HTTP status 200 if updated successfully with a body like [this](#Updated-Blog-Response-Structure) 
// - Also make sure in the response you return the updated blog document.
// Update a blog
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
  
//   ### DELETE /blogs/:blogId
//   - Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
//   - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Check if the blogId exists and is not deleted
    const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
    if (!blog) {
      return res.status(404).json({ status : false , message: "Blog not found" });
    }

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

// ### DELETE /blogs?queryParams
// - Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure)

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
  
      if (queryParams.tag) {
        filters.tags = queryParams.tag;
      }
  
      if (queryParams.subcategory) {
        filters.subcategory = queryParams.subcategory;
      }
  
      if (queryParams.unpublished === "true") {
        filters.isPublished = false;
      }
  
      // Find and mark the matching blogs as deleted
      const result = await Blog.updateMany(filters, { isDeleted: true, deletedAt: new Date() });
  
      if (result.n === 0) { // result.n means indicates the number of blogs that matched
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
};
