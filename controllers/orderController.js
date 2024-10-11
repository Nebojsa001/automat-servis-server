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

// exports.kanisteri = catchAsync(async (req, res, next) => {
//   const startDate = new Date("2024-10-10T10:01:06.858Z");
//   const result = await Order.aggregate([
//     // 1. trazimo sve ordere vece ili iste od startDate
//     {
//       $match: {
//         createdAt: { $gte: startDate },
//       },
//     },
//     //2. povezivanje svake narudzbe sa korisnicima tj consumersima
//     {
//       $lookup: {
//         from: "consumers",
//         localField: "consumerId",
//         foreignField: "_id",
//         as: "consumer",
//       },
//     },
//     {
//       $unwind: "$consumer",
//     },
//     {
//       $group: {
//         _id: "$consumerId", // pravi grupu po korisniku
//         totalGallons: { $sum: "$gallonsTaken" }, // sabira kanistere
//         firstName: { $first: "$consumer.firstName" },
//         lastName: { $first: "$consumer.lastName" },
//         address: { $first: "$consumer.address" },
//         phoneNumber: { $first: "$consumer.phoneNumber" },
//         gallonBalance: { $first: "$consumer.gallonBalance" },
//       },
//     },
//     {
//       $sort: {
//         totalGallons: -1,
//       },
//     },
//   ]);
//   res.status(200).json({
//     status: "success",
//     data: result,
//   });
// });
exports.getConsumersWithGallonsAfterDate = catchAsync(
  async (req, res, next) => {
    const startDate = new Date("2024-10-11T19:00:00.858Z");

    const result = await Consumer.aggregate([
      // 1. trazimo sve korisnike i povezujemo sa orderima
      {
        $lookup: {
          from: "orders",
          localField: "_id", // user id
          foreignField: "consumerId", // id usera u orderu
          as: "orders", // smještamo u orders
        },
      },
      // 2. Razbijanje niza u objekat
      {
        $unwind: {
          path: "$orders",
          preserveNullAndEmptyArrays: true, // čuvamo potrošače koji nemaju ordere
        },
      },
      // 3. Grupisanje po potrošaču
      {
        $group: {
          _id: "$_id", // Grupiše po ID-u potrošača
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          address: { $first: "$address" },
          phoneNumber: { $first: "$phoneNumber" },
          // 4. Sumiramo kanistere samo ako je narudžba nakon datuma, inače 0
          orderedGallons: {
            $sum: {
              $cond: {
                if: { $gte: ["$orders.createdAt", startDate] },
                then: { $ifNull: ["$orders.gallonsTaken", 0] },
                else: 0,
              },
            },
          },
          gallonBalance: { $first: "$gallonBalance" },
        },
      },
      // 5. Sortiranje rezultata po ukupnim kanisterima rastuće
      {
        $sort: {
          orderedGallons: 1, // rastuće sortiranje
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
);
