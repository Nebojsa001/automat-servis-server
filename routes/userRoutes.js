const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.post(
  "/signup",
  //   authController.protect,
  //   authController.restrictTo("superAdmin"),
  authController.signup
);
router.post("/register", authController.signup);
router.post("/login", authController.login);

// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);
// router.patch("/updatePassword", authController.updatePassword);

router.route("/").get(authController.protect, userController.getAllUsers);
router.patch("/updateme", authController.protect, userController.updateMe);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    authController.protect,
    authController.restrictTo("superAdmin"),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("superAdmin"),
    userController.deleteUser
  );
module.exports = router;
