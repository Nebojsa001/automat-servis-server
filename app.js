const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser"); // limitira velicinu req-a
//const rateLimit = require("express-rate-limit"); // limitira broj req u odredjenom intervalu vremena
// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
// const hpp = require("hpp");
const path = require("path");

//rute
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(cors());
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
