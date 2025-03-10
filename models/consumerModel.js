const mongoose = require("mongoose");
const validator = require("validator");

const consumerSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      //required: true,
      set: (value) => value.replace(/\s+/g, ""), // Uklanjanje razmaka prije validacije
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
      min: [0, "Dugovanje galona ne može biti negativan broj"],
    },
    upayedGallons: {
      type: Number,
      default: 0,
      min: [0, "Neplaćeni galoni ne može biti negativan broj"],
    },
    orderedGallons: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware za uklanjanje razmaka iz broja telefona

const Consumer = mongoose.model("Consumer", consumerSchema);

module.exports = Consumer;
