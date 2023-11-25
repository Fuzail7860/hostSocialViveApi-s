const express = require("express");
const router = express.Router();

const comment_controller = require("./comment.controller");
const auth = require("../../middleware/auth");

router.post("/addComment", auth, comment_controller.addComment);
router.delete("/deleteComment", auth, comment_controller.deleteComment);
router.get("/postComment", auth, comment_controller.postComment);


module.exports = router;
