const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "A blog with the title already exist"],
      required: [true, "A blog must have a title"],
    },
    category: {
      type: String,
      enum: {
        values: [
          "Entertainment",
          "Politics",
          "Business",
          "News",
          "Personal",
          "Food",
          "Health",
          "Others",
        ],
        message: "{VALUE} is not an option, Please enter a valid category",
      },
      required: [true, "Category cannot be empty "],
    },
    content: {
      type: String,
      required: [true, "A blog cannot be empty"],
    },
  },
  { timestamps: true }
);

const Blogs = mongoose.model("Blogs", BlogSchema);

module.exports = Blogs;
