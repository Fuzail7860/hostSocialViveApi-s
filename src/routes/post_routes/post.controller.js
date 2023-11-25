const { default: mongoose } = require("mongoose");
const postModel = require("../../models/post");
const base_url = "http://127.0.0.1:3000/";

const createPost = async (req, res) => {
  //  console.log("create post", req.files);
  try {
    const files = req.files;

    const media = files.map((val, i) => {
      return {
        type: val.mimetype == "video/mp4" ? "video" : "image",
        url: base_url + val.filename,
      };
    });
    req.body.media = media;
    console.log("media and description", req.body);

    const result = await postModel.create(req.body);
    res.send({
      data: result,
      status: true,
    });
  } catch (error) {
    res.status(403).json({ status: false, error: error });
  }
};

const allPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const userId = req.query.userId;
  console.log("userId.....", userId);
  const totalPosts = await postModel.countDocuments({});

  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  try {
    let result = await postModel.aggregate([
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "likes",
        },
      },
      {
        $addFields: {
          isLike: {
            $cond: {
              if: { $gt: [{ $size: "$likes" },0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup:{
          from:"users",
          localField:"userId",
          foreignField:"_id",
          as:"user"
        },
      },
      {
        $unwind:"$user"
      },
      {
        $project: { 
          likes: 0 ,
          "user.password":0,
          "user.token":0,
          "user.fcmToken":0,
          "user.isDeleted":0,
          "user.links":0,
          "user.deviceType":0,
        
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.send({
      data: result,
      status: true,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.log("error..!!", error);
    res.status(401).json({ status: false, error: error });
  }
};

module.exports = {
  createPost,
  allPosts,
};
