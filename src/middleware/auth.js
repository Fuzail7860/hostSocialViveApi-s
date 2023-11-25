const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = !!req?.headers["authorization"]
    ? req?.headers["authorization"].split(" ")[1]
    : null;
  // console.log("req header token", token);
  if (!token) {
    return res.status(401).json({ status: false,message:"A token is required for authentication", error:"token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({ status: false,message:"Token is not  valid", error: error });
  }
  next();
};

module.exports = verifyToken;
