const express = require("express");
const router = express.Router();

// controller
const {
  createUser,
  login,
  getCurrentUser,
  update,
  getUserById,
} = require("../controllers/UserController");

// middlewares
const validate = require("../middlewares/handleValidations");
const {
  userCreateValidation,
  loginValidation,
  updateValidation,
} = require("../middlewares/UserValidations");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

// user routes
router.post("/register", userCreateValidation(), validate, createUser);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put(
  "/",
  authGuard,
  imageUpload.single("profileImage"),
  updateValidation(),
  validate,
  update
);
router.get("/:id", getUserById);

module.exports = router;
