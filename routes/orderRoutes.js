const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(
    //authController.protect,
    orderController.getAllOrders
  )
  .post(
    authController.protect,
    authController.restrictTo("driver", "superAdmin"),
    orderController.createOrder
  );
router
  .route("/get-consumers-with-gallons-after-date/:date")
  .get(
    authController.protect,
    authController.restrictTo("driver", "superAdmin"),
    orderController.getConsumersWithGallonsAfterDate
  );

router
  .route("/:id")
  .get(authController.protect, orderController.getOrder)
  .patch(
    authController.protect,
    authController.restrictTo("superAdmin"),
    orderController.updateOrder
  )
  .delete(
    authController.protect,
    authController.restrictTo("superAdmin"),
    orderController.deleteOrder
  );

module.exports = router;
