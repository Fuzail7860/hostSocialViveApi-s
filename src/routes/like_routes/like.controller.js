const likeModel = require("../../models/like");
const postModel = require("../../models/post");

const likeDislike = async (req, res) => {
  //  console.log("create post", req.files);
  const { postId, userId } = req.body;
  const existingLike = await likeModel.findOne({ postId, userId });

  try {
    if (!existingLike) {
      await likeModel.create(req.body);
      await postModel.findByIdAndUpdate(
        postId,
        { $inc: { likeCount: 1 } },
        { new: true }
      );
      return res.status(200).json({ message: "Like added successfully..!!" });
    } else {
      // console.log("existID",);
      await likeModel.findOneAndDelete(existingLike._id);
      await postModel.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
      return res.status(200).json({ message: "Like remove successfully..!!" });
    }
  } catch (error) {
    res.status(403).json({ status: false, error: error });
    console.log("erorr!!!!", error);
  }
};

const postLikes = async (req, res) => {
  console.log("post likes", req.query);
  const { postId, page, limit } = req.query;
  const totalLikes = await likeModel.countDocuments({ postId });
  //   console.log(totalComments)
  const totalPages = Math.ceil(totalLikes / limit);
  const startIndex = (page - 1) * limit;
  try {
    let result = await likeModel
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
  likeDislike,
  postLikes,
};
