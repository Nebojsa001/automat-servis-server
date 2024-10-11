const Order = require("./../models/orderModel");
const Consumer = require("./../models/consumerModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const appError = require("../utils/appError");

exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const orders = await features.query.populate(
    "consumerId",
    "firstName lastName gallonBalance"
  );
  res.status(200).json({
    status: "success",
    result: orders.length,
    orders,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new appError("No order found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new appError("No order found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new appError("No order found with that ID", 404));
  }
  const consumer = await Consumer.findById(order.consumerId);
  const balance = order.gallonsTaken - order.gallonsReturned;

  consumer.gallonBalance -= balance;
  await consumer.save();
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Order successfully deleted",
  });
});

exports.kanisteri = catchAsync(async (req, res, next) => {
  const startDate = new Date("2024-10-10T10:01:06.858Z");
  const result = await Order.aggregate([
    // 1. trazimo sve ordere vece ili iste od startDate
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    //2. povezivanje svake narudzbe sa korisnicima tj consumersima
    {
      $lookup: {
        from: "consumers",
        localField: "consumerId",
        foreignField: "_id",
        as: "consumer",
      },
    },
    {
      $unwind: "$consumer",
    },
    {
      $group: {
        _id: "$consumerId", // Grupisanje po korisniku
        totalGallons: { $sum: "$gallonsTaken" }, // Saberi broj kanistera
        firstName: { $first: "$consumer.firstName" }, // Uzimanje imena korisnika
        lastName: { $first: "$consumer.lastName" }, // Prezime korisnika
        address: { $first: "$consumer.address" }, // Adresa korisnika
        phoneNumber: { $first: "$consumer.phoneNumber" }, // Broj telefona korisnika
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: result,
  });
});
