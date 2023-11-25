const userModel = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  //   console.log("I'm signup");
  try {
    const { email, userName, password } = req.body;
    let checkUser = await userModel.findOne({
      $or: [{ email: email }, { userName: userName }],
    });

    if (!checkUser) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      let result = await userModel.create({
        ...req.body,
        password: passwordHash,
      });
      const token = jwt.sign(
        { userId: result?._id, email: email },
        process.env.TOKEN_KEY
      );
      result.token = token;
      res.send({
        data: result,
        message: "user created successfully...!!!",
        status: true,
      });
    } else {
      res.status(403).json({ status: false, error: "user already exist" });
    }
  } catch (error) {
    res.status(403).json({ status: false, error: error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let result = await userModel.findOne({ email: email });
    if (!!result) {
      let isPasswordValid = await bcrypt.compare(password, result.password);
      if (!!isPasswordValid) {
        const token = jwt.sign(
          { userId: result?._id, email: email },
          process.env.TOKEN_KEY
        );
        const deepCopy = JSON.parse(JSON.stringify(result));
        deepCopy.token = token;
        delete deepCopy.password;
        res.send({
          data: deepCopy,
          status: true,
        });
      } else {
        res
          .status(403)
          .json({ status: false, error: "Incorrect email/password" });
      }
    } else {
      res
        .status(403)
        .json({ status: false, error: "Incorrect email/password" });
    }
  } catch (error) {
    res.status(403).json({ status: false, error: error });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (otp === "1234") {
    try {
      let result = await userModel
        .findOneAndUpdate(
          { email: email },
          { $set: { validOTP: true } },
          { new: true }
        )
        .select("-password");
      if (!!result) {
        res.send({
          data: result,
          status: true,
        });
      } else {
        res.status(403).json({ status: false, error: "User not found" });
      }
    } catch (error) {
      res.status(403).json({ status: false, error: error });
    }
  } else {
    res.status(403).json({ status: false, error: "Otp not valid" });
  }
};

module.exports = {
  createUser,
  loginUser,
  verifyOTP,
};
