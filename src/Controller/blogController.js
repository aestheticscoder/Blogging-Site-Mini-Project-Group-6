const Blog = require("../Models/blogModel");
const Author = require("../Models/authorModel");
const mongoose = require("mongoose");





const createBlog = async (req, res) => {
  try {
    const data = req.body;
      // console.log(data.authorId)

      // required fields must be validated.
   if(!data.tittle || !data.body || !data.authorId || !data.category ) return res.status(400).send({status : false , message : "missing mandatory fields"})
      if(data.authorId!=req.access_token.authorId)  return res.status(403).send({status : false , message : "unauthorized"})

      //validate authorId 
      const isValidId = mongoose.isValidObjectId(data.authorId);
      if (!isValidId) {
        return res.status(400).json({ status: false, message: "Invalid authorId" });
      }
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
    res.status(500).json({ status:false, message: error.message });
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
      filters.tags =  {$in:  tags.split(",") };
   
    }
   
    


    if (subcategory) {
      filters.subcategory = { $in: subcategory.split(",") };
    }

    const blogs = await Blog.find(filters);
     //  if with that filter we didn't get any doucment in find query we get an empty array
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

               // checking the decoded token's authorId and blog's authorId is same or not    :- checking authorization
        
      if(req.access_token.authorId!=blog.authorId) return res.status(403).send({status:false , message: "unauthorized"})

      //updating all fields based on conditions

    blog.title = title || blog.title;
    blog.body = body || blog.body;

    if (tags && tags.length > 0) {
      blog.tags.push(...tags);
    //  blog.tags = {$addToSet:{"blog.tags":{$each: tags}}}
    }


    
    // if (tags && tags.length > 0) {
    //   blog.tags = { $addToSet: { tags: { $each: tags } } };                 // not working
    // }
    

    if (subcategory && subcategory.length > 0) {
      blog.subcategory.push(...subcategory);
    }

    
      blog.isPublished = true;
      blog.publishedAt = new Date();

    const updatedBlog = await blog.save();
    res.status(200).json({ status: true, message: "Blog updated", data: updatedBlog });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
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

    // checking rights of author  for deletion
    if(blog.authorId!=req.access_token.authorId)  return res.status(403).send({status : false , message : "unauthorized"})

    blog.isDeleted = true;
    blog.deletedAt = new Date();

    const deleted = await blog.save();
    res.status(200).json({
        status: true,
        message: ""
      });
  } catch (error) {
    res.status(500).json({status:false , message : error.message });
  }
};


///----------------------------------/////

const deleteBlogsByQuery = async (req, res) => {
  try {
    const queryParams = req.query;

    // Check if any query parameters are provided
    if (Object.keys(queryParams).length === 0) {
      return res.status(400).json({ status: false, message: "No search parameters provided" });
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



    if (queryParams.unpublished === "true") {          //problem
      filters.isPublished = false;
    }

    const blogData = await Blog.findOne(filters)
          // const blogs = await blog.find(filters)   //problem
       
           ///checking rights of author

      if(blogData.authorId!=req.access_token.authorId)  return res.status(403).send({status : false , message : "unauthorized"})



    // Find and mark the matching blogs as deleted

    // const result = await Blog.updateMany(filters, {$set: { isDeleted: true, deletedAt: new Date() }});         //$set we have to use

    // console.log(result, result.n)
    // if (result.modifiedCount == 0) { // result.modifiedCount means indicates the number of blogs that matched and modified
    //   return res.status(404).json({ status: false, message: "No blogs found" });
    // }
    
    blogData.isDeleted = true;
    blogData.deletedAt = new Date()

    const saved = blogData.save()

    res.status(200).json({ status: true, message: " " });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  deleteBlogsByQuery
};
