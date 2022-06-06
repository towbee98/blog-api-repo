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
      .select("-__v")
      .sort({ createdAt: "desc" });

    res.status(200).json({
      status: "success",
      length: stories.length,
      data: stories,
      message: "Blog stories successfully retrieved",
    });
  } catch (error) {
    return;
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
    // console.log(error.kind);
    if (error.kind === "ObjectId")
      return next(new CreateError(404, "Blog not found"));
    return next(new CreateError(400, error.message));
  }
};

exports.CreateBlog = async (req, res, next) => {
  try {
    const data = req.body;
    Object.keys(data).forEach((el) => (data[el] = data[el].trim()));
    const { title, category, content } = data;
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
    next(error);
  }
};

exports.UpdateBlog = async (req, res, next) => {
  try {
    const blogID = req.params.id;
    const update = { ...req.body };
    Object.keys(update).forEach((el) => (update[el] = update[el].trim()));
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
    if (error.kind === "ObjectId")
      return next(new CreateError(404, "Blog not found"));
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
    if (error.kind === "ObjectId")
      return next(new CreateError(404, "Blog not found"));
    return next(new CreateError(400, error.message));
  }
};
