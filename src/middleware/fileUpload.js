const multer = require("multer");
const path = require("path");
const util = require("util");

const storage = multer.diskStorage({
  destination:"uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov/; //Allowed file extention

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
   // check the extention
  const mimetype = filetypes.test(file.mimetype); // Check the mime type
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error:Images only (jpeg,jpg,png,gif,mp4,mov)!");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array('file',5);

const uploadMiddleWare = util.promisify(upload);

module.exports = uploadMiddleWare;
