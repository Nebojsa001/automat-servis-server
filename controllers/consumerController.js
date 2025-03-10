const Consumer = require("./../models/consumerModel");
const Order = require("./../models/orderModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const appError = require("../utils/appError");
// const sendEmail = require("./../utils/email");

exports.createConsumer = catchAsync(async (req, res, next) => {
  const { userName, phoneNumber, companyName, city, address, watherDispenser } =
    req.body;
  const consumer = await Consumer.create({
    userName,
    phoneNumber,
    companyName,
    city,
    address,
    watherDispenser,
  });
  res.status(201).json({
    status: "success",
    data: {
      consumer,
    },
  });
});

exports.getAllConsumers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Consumer.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const consumers = await features.query;

  res.status(200).json({
    status: "success",
    result: consumers.length,
    consumers,
  });
});

exports.getConsumer = catchAsync(async (req, res, next) => {
  const consumer = await Consumer.findById(req.params.id);

  if (!consumer) {
    return next(new appError("No consumer found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      consumer,
    },
  });
});

exports.updateConsumer = catchAsync(async (req, res, next) => {
  const consumer = await Consumer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!consumer) {
    return next(appError("Taj korisnik nije pronađen", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      consumer,
    },
  });
});

exports.deleteConsumer = catchAsync(async (req, res) => {
  const deleteConsumersOrder = await Order.deleteMany({
    consumerId: req.params.id,
  });
  const deletedConsumer = await Consumer.findByIdAndDelete(req.params.id);

  if (!deletedConsumer) {
    return next(appError("Taj korisnik nije pronađen", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Uspešno ste obrisali korisnika",
  });
});
