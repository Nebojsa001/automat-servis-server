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
      set: (value) => value.replace(/\s+/g, ""), // Uklanjanje razmaka prije validacije
      // validate: {
      //   validator: function (el) {
      //     // Regex za mobilne i fiksne brojeve u BiH
      //     const phoneRegex = /^(?:\+387|00387|0)(6\d{1}\d{6}|3\d{1}\d{6})$/;
      //     return phoneRegex.test(el); // Validacija telefonskog broja
      //   },
      //   message:
      //     "Neispravan broj telefona. Prihvaćeni su mobilni i fiksni brojevi u BiH.",
      // },
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
  },
  { timestamps: true }
);

// Middleware za uklanjanje razmaka iz broja telefona

const Consumer = mongoose.model("Consumer", consumerSchema);

module.exports = Consumer;
