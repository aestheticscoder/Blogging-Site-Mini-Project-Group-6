const Blog = require("./src/Models/blogModel");




// const updateBlog = async (req,res) =>{
//   try{const blogId = req.params.blogId
//   const data = req.body
//   console.log(data)
//   const check = mongoose.isValidObjectId(blogId);
//   if(!data) {
//        return res.status(400).json({
//       status: false,
//       message: "invalid update field",
//     });
//   }
//   if (!check) {
//     return res.status(400).json({
//       status: false,
//       message: "invalid blogId",
//     });

//   }
//    const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
//   if (!blog) {
//     return res.status(404).json({ error: "Blog not found" });
//   }
//   const updated = await Blog.findOneAndUpdate(
    // {_id: blogId,isDeleted : false},
    // {
        // $set:{title:data.title,body:data.body,isPublished : data.isPublished, publishedAt : Date.now(), },
    // $addToSet : {tags : data.tags}
// },
    // {new:true})
//      res.status(200).send({status:true,message:updated})
// }catch(err){console.log(err.message)}
// }
