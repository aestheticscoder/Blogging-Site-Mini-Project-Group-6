const Blog =require("../Models/blogModel");
const Author = require("../Models/authorModel");

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, body, authorId, tags, category, subcategory } = req.body;

    // Check if the authorId exists
    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(400).json({ error: 'Invalid authorId' });
    }

    const blog = new Blog({
      title,
      body,
      authorId,
      tags,
      category,
      subcategory
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isDeleted: false, isPublished: true });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get blogs with filters
const getFilteredBlogs = async (req, res) => {
  try {
    const { authorId, category, tags } = req.query;

    const filters = {};

    if (authorId) {
      filters.authorId = authorId;
    }

    if (category) {
      filters.category = category;
    }

    if (tags) {
      filters.tags = { $in: tags.split(',') };
    }

    const blogs = await Blog.find({ ...filters, isDeleted: false, isPublished: true });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a blog
const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, body, tags, subcategory, isPublished } = req.body;

    // Check if the blogId exists and is not deleted
    const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.title = title;
    blog.body = body;
    blog.tags = tags ? [...blog.tags, ...tags] : blog.tags;
    blog.subcategory = subcategory ? [...blog.subcategory, ...subcategory] : blog.subcategory;
    blog.isPublished = isPublished || blog.isPublished;
    blog.updatedAt = new Date();

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Check if the blogId exists and is not deleted
    const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.isDeleted = true;
    blog.deletedAt = new Date();

    await blog.save();
    res.status(200).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getFilteredBlogs,
  updateBlog,
  deleteBlog
};
