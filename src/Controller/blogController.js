const blogModel = require("../Models/blogModel");

const mongoose = require("mongoose");

const createBlog = async (req, res) => {
  try {
    const data = req.body;

    // required fields must be validated.
    if (!data.title || !data.body || !data.category)
      return res
        .status(400)
        .send({ status: false, message: "missing mandatory fields" });

    data.authorId = req["x-api-key"].authorId;

    const createdBlog = await blogModel.create(data);

    res.status(201).json({
      status: true,
      data: createdBlog,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ******************************************************************************* //

const getAllBlogs = async (req, res) => {
  try {
    const { authorId, category, tags, subcategory } = req.query;
    const filters = { isDeleted: false, isPublished: true };

    if (authorId) {
      const isValidId = mongoose.isValidObjectId(authorId);
      if (!isValidId) {
        return res.status(400).json({
          status: false,
          message: "Invalid authorId",
        });
      }

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

    const blogs = await blogModel.find(filters);
    // if with that filter we didn't get any
    //document in find query we get an empty array
    if (blogs.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No blogs found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Blogs list",
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ******************************************************************************* //

const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Check if the blogId is valid
    const isValidId = mongoose.isValidObjectId(blogId);
    if (!isValidId) {
      return res.status(400).json({
        status: false,
        message: "Invalid blogId",
      });
    }

    // Check if the blog exists and is not deleted
    const blog = await blogModel.findOne({ _id: blogId, isDeleted: false });

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    // checking the decoded token's authorId and blog's authorId is same or not
    //:- checking authorization
    if (req["x-api-key"].authorId != blog.authorId)
      return res.status(403).send({
        status: false,
        message: "unauthorized",
      });

    const { title, body, tags, subcategory } = req.body;

    /// handling edge case for tags and subcategory are not present or present as a string

    if (typeof tags != Object) {
      //here I am using Object for array(type)==object
      tags = [tags];
    }
    if (typeof subcategory != Object) {
      subcategory = [subcategory];
    }

    //updating all fields based on conditions

    const updatedBlog = await blogModel.findByIdAndUpdate(
      req.params.blogId,
      {
        $set: {
          title,
          body,
          category,
          isPublished: true,
          publishedAt: new Date(),
        },
        $addToSet: {
          tags: { $each: tags },
          subcategory: { $each: subcategory },
        },
      },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "Blog updated",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ******************************************************************************* //

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Check if the blogId is valid
    const isValidId = mongoose.isValidObjectId(blogId);
    if (!isValidId) {
      return res.status(400).json({
        status: false,
        message: "Invalid blogId",
      });
    }

    // Check if the blogId exists and is not deleted
    const blog = await blogModel.findOne({ _id: blogId, isDeleted: false });

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    // checking rights of author  for deletion
    if (blog.authorId != req["x-api-key"].authorId)
      return res.status(403).send({
        status: false,
        message: "unauthorized",
      });

    blog.isDeleted = true;
    blog.deletedAt = new Date();

    const deleted = await blog.save();
    res.status(200).json({
      status: true,
      message: "successful deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ******************************************************************************* //

const deleteBlogsByQuery = async (req, res) => {
  try {
    const { authorId, category, tags, subcategory, unpublished } = req.query;

    // Check if no any query parameters are provided
    if (Object.keys(req.query).length === 0) {
      return res.status(400).json({
        status: false,
        message: "No search parameters provided",
      });
    }

    const filters = { isDeleted: false };

    // Apply filters based on the query parameters
    if (category) {
      filters.category = category;
    }

    if (authorId) {
      const isValidId = mongoose.isValidObjectId(authorId);
      if (!isValidId) {
        return res.status(400).json({
          status: false,
          message: "Invalid authorId",
        });
      }

      filters.authorId = authorId;
    }

    if (tags) {
      filters.tags = { $in: tags.split(",") };
    }

    if (subcategory) {
      filters.subcategory = { $in: subcategory.split(",") };
    }

    if (unpublished === "true") {
      filters.isPublished = false;
    }

    const blogData = await blogModel.findOne(filters);
    if (!blogData)
      return res.status(404).json({ status: false, msg: "blog not exist" });

    if (blogData.authorId != req["x-api-key"].authorId)
      return res.status(403).send({
        status: false,
        message: "unauthorized",
      });

    blogData.isDeleted = true;
    blogData.deletedAt = new Date();

    const saved = blogData.save();

    res.status(200).json({
      status: true,
      message: "successful deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  deleteBlogsByQuery,
};
