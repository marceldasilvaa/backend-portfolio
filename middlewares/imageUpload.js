const multer = require("multer");
const path = require("path");
const fs = require("fs");

// local storage to image
const imageStore = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else {
      folder = "photos";
    }

    cb(null, path.join(__dirname, "..", "uploads", folder));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStore,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only jpg or png formats
      cb(new Error("Por favor, envie apenas jpg/jpeg ou png!"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
