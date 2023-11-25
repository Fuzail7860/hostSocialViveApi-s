const express = require("express");
const rootRouter = express.Router();

const users = require("./user_routes/user.routes");
const posts = require("./post_routes/post.routes");
const likes = require("./like_routes/like.routes");
const comments = require("./comment_routes/comment.routes");

rootRouter.use("/", users);
rootRouter.use("/", posts);
rootRouter.use("/", likes);
rootRouter.use("/", comments);

module.exports = rootRouter;
