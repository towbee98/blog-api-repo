const mongoose = require("mongoose");
const slugify = require("slugify");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // unique: [true, "A blog with the title already exist"],
      required: [true, "A blog must have a title"],
      lowercase: true,
    },
    slug: {
      type: String,
      unique: [true, "A blog with the same title already exists."],
    },
    category: {
      type: String,
      enum: {
        values: [
          "entertainment",
          "politics",
          "business",
          "news",
          "personal",
          "food",
          "health",
          "others",
        ],
        message:
          "{VALUE} is not an option, Please choose from the following category: entertainment,politics,business,news,personal,food,health,others",
      },
      required: [true, "Category cannot be empty "],
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "A blog cannot be empty"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    // comments: [
    //   {
    //     content: String,
    //     createdBy: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Users",
    //     },
    //   },
    //   { timestamps: true },
    // ],
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
    },
  },
  { timestamps: true }
);

BlogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lowercase: false });
  next();
});

const Blogs = mongoose.model("Blogs", BlogSchema);

module.exports = Blogs;
