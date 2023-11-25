const commentModel = require("../../models/comment");
const postModel = require("../../models/post");

const addComment = async (req, res) => {
  const { postId } = req.body;

  try {
    const result = await commentModel.create(req.body);
    await postModel.findByIdAndUpdate(
      postId,
      { $inc: { commentCount: 1 } },
      { new: true }
    );
    res.send({
      status: 200,
      message: "comment added successfully..!!",
      data: result,
    });
  } catch (error) {
    res.status(403).json({ status: false, error: error });
    console.log("erorr!!!!", error);
  }
};

const deleteComment = async (req, res) => {
  // console.log("delete comment", req.body);
  // return;
  const { userId, commentId } = req.body;
  try {
    let deleteComment = await commentModel.findByIdAndDelete({
      _id: commentId,
      userId,
    });
    if (!!deleteComment) {
      await postModel.findByIdAndUpdate(
        deleteComment.postId,
        { $inc: { commentCount: -1 } },
        { new: true }
      );
      res.send({
        status: 200,
        message: "comment deleted successfully..!!",
      });
    } else {
      res.status(403).json({ status: false, message: "comment not deleted" });
    }
  } catch (error) {
    res.status(403).json({ status: false, error: error });
    console.log("erorr!!!!", error);
  }
};

const postComment = async (req, res) => {
  //   console.log("post likes", req.query);
  const { postId, page, limit } = req.query;
  const totalComments = await commentModel.countDocuments({ postId });
  //   console.log(totalComments)
  const totalPages = Math.ceil(totalComments / limit);
  const startIndex = (page - 1) * limit;

  try {
    let result = await commentModel
      .find({ postId: postId })
      .populate({ path: "userId", select: "userName fullName" })
      .skip(startIndex)
      .limit(limit)
      .exec();
    res.send({
      data: result,
      status: true,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(403).json({ status: false, error: error });
    console.log("erorr!!!!", error);
  }
};

module.exports = {
  addComment,
  deleteComment,
  postComment,
};
