const { Router } = require("express");
const Auth = require("../middlewares/auth");
const CommentController = require("../controllers/comments.controller");
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(CommentController.getBlogComments)
  .post(Auth.protect, CommentController.addComment);
router.use(Auth.protect);
router
  .route("/:commentID")
  .patch(CommentController.updateComment)
  .delete(CommentController.removeComment);

module.exports = router;
