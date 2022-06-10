const { response } = require("express");
const Blogs = require("./../models/blog");
const CreateError = require("./../utils/ErrorClass");

exports.GetAllBlogs = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    //Filter out the query parameters
    const allowedFields = ["category", "title"];
    Object.keys(queryObj).forEach((el) => {
      queryObj[el] = queryObj[el].trim().toLowerCase();
      if (!allowedFields.includes(el) || !queryObj[el]) delete queryObj[el];
    });
    //Find and sort the data being queried
    // console.log(queryObj);
    const stories = await Blogs.find(queryObj)
      .populate({ path: 'author', select: 'name'})
      .select("-__v -slug")
      .sort({ createdAt: "desc" });
    res.status(200).json({
      status: "success",
      length: stories.length,
      data: stories,
      message: "Blog stories successfully retrieved",
    });
  } catch (error) {
    next(error);
  }
};

exports.GetABlog = async (req, res, next) => {
  try {
    const blogID = req.params.id.trim();
    if (!blogID) return next(new CreateError(400, "Specify a valid blog id"));
    const story = await Blogs.findById(blogID).select("-__v -slug")
    if (!story) return next(new CreateError(400, "Blog not found "));
    res.status(200).json({
      status: "success",
      data: story,
      message: "Blog successfully fetched",
    });
  } catch (error) {
    // console.log(error.kind);
    if (error.kind === "ObjectId")
      return next(new CreateError(404, "Blog not found"));
    return next(new CreateError(400, error.message));
  }
};

exports.CreateBlog = async (req, res, next) => {
  try {
    const author = req.user._id;
    const data = req.body;
    Object.keys(data).forEach((el) => (data[el] = data[el].trim()));
    const { title, category, content } = data;
    // console.log(title, category, content);
    const blog = await Blogs.create({ title, category, content, author });
    //console.log(blog);
    if (!blog)
      return next(new CreateError(400, "An error occured, Please try again"));
    res.status(201).json({
      status: "success",
      data: blog,
      message: "Blog uploaded succssfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.UpdateBlog = async (req, res, next) => {
  try {
    const blogID = req.params.id;
    if(!blogID) return next(new CreateError(400,"Specify a valid blog id"))
    const author= req.user._id;
    if(!author) return next(new CreateError(400,"Sorry,Please login again"));
    const update = { ...req.body };
    Object.keys(update).forEach((el) => (update[el] = update[el].trim()));
    const updatedStory = await Blogs.findOneAndUpdate({_id:blogID,author:author}, update, {
      new: true,
      runValidators: true,
    }).select("-_v")
    if (!updatedStory) return next(new CreateError(400, "Blog not found"));
    res.status(200).json({
      status: "success",
      data: updatedStory,
      message: "Story updated successfully",
    });
  } catch (error) {
    if (error.kind === "ObjectId")
      return next(new CreateError(404, "Blog not found"));
    next(new CreateError(400, error.message));
  }
};

exports.getMyBlogs= async (req,res,next)=>{
  try {
    const author= req.user._id;
    const blogs=await Blogs.find({author}).select("-__v -author")
      .sort({ createdAt: "desc" });;
      if(!blogs) next(new CreateError(404,"Blogs not found "));
      res.status(200).json({
        status:"success",
        data:blogs
      })
  } catch (error) {
    next(error)
  }
}

exports.removeBlog = async (req, res, next) => {
  try {
    const blogID = req.params.id;
    const user = req.user._id;
    // const removedBlog = await Blogs.findByIdAndDelete(blogID);
    const removedBlog = await Blogs.findOneAndDelete({
      _id: blogID,
      author: user,
    });

    res.status(204).json({
      status: "success",
      data: removedBlog,
      message: "Story deleted successfully",
    });
  } catch (error) {
    if (error.kind === "ObjectId")
      return next(new CreateError(404, "Blog not found"));
    return next(new CreateError(400, error.message));
  }
};
