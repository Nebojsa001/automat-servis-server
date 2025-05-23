const express = require("express");
const cors = require("cors");
const path = require("path");

//rute
const userRouter = require("./routes/userRoutes");
const consumerRouter = require("./routes/consumerRoutes");
const orderRouter = require("./routes/orderRoutes");

const app = express();
app.use(cors());
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log(req);

  const authorizationCode = req.query.code;
  console.log(authorizationCode);
  //res.send("Hello, welcome to the PhotoFeedback API!"); // Poruka koju ćete videti na localhost:3000
  res.status(200).json({
    message: "Hello, welcome to the PhotoFeedback API!",
    code: authorizationCode,
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/consumer", consumerRouter);
app.use("/api/v1/order", orderRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
