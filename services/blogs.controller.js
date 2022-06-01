const Blogs = require("./../models/blog");
const CreateError = require("./../utils/ErrorClass");

exports.GetAllBlogs = async (req, res, next) => {
  try {
    //const query=req.query;
    const stories = await Blogs.find().select("-__v");
    res.status(200).json({
      status: "success",
      length: stories.length,
      data: stories,
      message: "Blog stories successfully retrieved",
    });
  } catch (error) {
    next(new CreateError(400, error.message));
  }
};

exports.GetABlog = async (req, res, next) => {
  try {
    const blogID = req.params.id;
    if (!blogID) return next(new CreateError(400, "Specify a valid blog id"));
    const story = await Blogs.findById(blogID);
    if (!story) return next(new CreateError(400, "Blog not found "));
    res.status(200).json({
      status: "success",
      data: story,
      message: "Blog successfully fetched",
    });
  } catch (error) {
    return next(new CreateError(400, error.message));
  }
};

exports.CreateBlog = async (req, res, next) => {
  try {
    const { title, category, content } = req.body;
    // console.log(title, category, content);
    const blog = await Blogs.create({ title, category, content });
    //console.log(blog);
    if (!blog)
      return next(new CreateError(400, "An error occured, Please try again"));
    res.status(201).json({
      status: "success",
      data: blog,
      message: "Blog uploaded succssfully",
    });
  } catch (error) {
    next(new CreateError(400, error.message));
  }
};

exports.UpdateBlog = async (req, res, next) => {
  try {
    const blogID = req.params.id;
    const update = { ...req.body };
    const updatedStory = await Blogs.findByIdAndUpdate(blogID, update, {
      new: true,
      runValidators: true,
    });
    if (!updatedStory) return next(new CreateError(400, "Blog not found"));
    res.status(200).json({
      status: "success",
      data: updatedStory,
      message: "Story updated successfully",
    });
  } catch (error) {
    next(new CreateError(400, error.message));
  }
};

exports.removeBlog = async (req, res, next) => {
  try {
    const blogID = req.params.id;
    const removedBlog = await Blogs.findByIdAndDelete(blogID);
    res.status(204).json({
      status: "success",
      data: removedBlog,
      message: "Story deleted successfully",
    });
  } catch (error) {
    return next(new CreateError(400, error.message));
  }
};
