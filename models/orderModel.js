const mongoose = require("mongoose");
const validator = require("validator");
const Consumer = require("./consumerModel");
const { DateTime } = require("luxon");

const orderSchema = new mongoose.Schema(
  {
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },
    gallonsTaken: {
      type: Number,
      required: true,
    },
    gallonsReturned: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  console.log(DateTime.now().setZone("UTC+2").toJSDate());

  const balance = this.gallonsTaken - this.gallonsReturned;

  let consumer = await Consumer.findById(this.consumerId);
  consumer.gallonBalance = consumer.gallonBalance + balance;

  await consumer.save();
  next();
});

orderSchema.methods.getOrderDateInLocal = function () {
  return DateTime.fromJSDate(this.orderDate)
    .setZone("UTC+2") // Konvertuj u vremensku zonu Beograda
    .toFormat("yyyy-MM-dd HH:mm:ss"); // Formatira datum
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
