const multer = require("multer");

const storage = multer.memoryStorage()

const imageUpload = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only jpg or png formats
      cb(new Error("Por favor, envie apenas jpg/jpeg ou png!"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
