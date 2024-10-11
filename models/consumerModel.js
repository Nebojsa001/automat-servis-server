const mongoose = require("mongoose");
const validator = require("validator");

const consumerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (el) {
          return validator.isMobilePhone(el, "bs-BA");
        },
        message: "Neispravan broj telefona",
      },
    },
    city: {
      type: String,
      required: true,
      default: "Brod",
    },
    address: {
      type: String,
      required: true,
    },
    watherDispenser: {
      type: String,
      default: 1,
    },
    gallonBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Consumer = mongoose.model("Consumer", consumerSchema);

module.exports = Consumer;
