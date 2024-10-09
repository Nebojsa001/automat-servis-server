const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const appError = require("../utils/appError");
const pug = require("pug");
const path = require("path");
// const sendEmail = require("./../utils/email");

//functions
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query);
  // const users = await User.find();
  const users = await features.query;

  res.status(200).json({
    status: "success",
    result: users.length,
    users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new appError("No User found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Error ako user POST passwrd
  if (req.body.password || req.body.passwordConfirm) {
    return next(new appError("Ne možete mijenjati lozinku na ovaj način", 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "phoneNumber"
  );

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.user.role != "superAdmin" && req.body.password) {
    return next(new appError("Ne možete mijenjati lozinku na ovaj način", 400));
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(appError("Taj korisnik nije pronađen", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    return next(appError("Taj korisnik nije pronađen", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Uspešno ste obrisali korisnika",
  });
});
