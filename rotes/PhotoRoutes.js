const express = require("express");
const router = express.Router();

// controller
const {
  insertPhoto,
  removePhoto,
  getAllPhotos,
  getPhotosUser,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhoto,
} = require("../controllers/PhotoController");

// middlewares
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidations");
const userAdminGuard = require("../middlewares/adminGuard");
const { imageUpload } = require("../middlewares/imageUpload");
const {
  photoInsertValidation,
  photoUpdateValidation,
  photoCommentValidation,
} = require("../middlewares/PhotoValidations");

router.post(
  "/post",
  authGuard,
  userAdminGuard,
  imageUpload.single("image"),
  photoInsertValidation(),
  validate,
  insertPhoto
);
router.delete("/:id", authGuard, userAdminGuard, removePhoto);
router.get("/", authGuard, getAllPhotos);
router.get("/user/:id", authGuard, getPhotosUser);
router.get("/search", authGuard, searchPhoto);
router.get("/:id", authGuard, getPhotoById);
router.put(
  "/update/:id",
  authGuard,
  userAdminGuard,
  photoUpdateValidation(),
  validate,
  updatePhoto
);
router.put("/like/:id", authGuard, likePhoto);
router.put(
  "/comment/:id",
  authGuard,
  photoCommentValidation(),
  validate,
  commentPhoto
);

module.exports = router;
