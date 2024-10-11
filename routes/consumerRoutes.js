const express = require("express");
const consumerController = require("./../controllers/consumerController");
const authController = require("./../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, consumerController.getAllConsumers)
  .post(
    authController.protect,
    authController.restrictTo("driver", "superAdmin"),
    consumerController.createConsumer
  );

router
  .route("/:id")
  .get(authController.protect, consumerController.getConsumer)
  .patch(
    authController.protect,
    authController.restrictTo("superAdmin"),
    consumerController.updateConsumer
  )
  .delete(
    authController.protect,
    authController.restrictTo("superAdmin"),
    consumerController.deleteConsumer
  );
module.exports = router;
