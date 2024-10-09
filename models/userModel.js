const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Neispravna email adresa"],
  },
  role: {
    type: String,
    enum: ["user", "driver", "superAdmin"],
    default: "user",
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (el) {
        return validator.isMobilePhone(el, "bs-BA");
      },
      message: "Neispravan broj telefona",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Lozinka mora sadržavati 8 ili više karaktera"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    // Validate radi samo na sava, zato ne koristimo nikada findByIdAndUpdate i middleware "save" ne bi radio
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Lozinka se ne podudara",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Ako password nije menjan onda se hesuje
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  // PROVJERA PASSWORD
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp; //ako nije promijenjeno changetTimeStamp je 0 znaci ide na false
  }
  return false; //if user not change pass
};

userSchema.methods.isAccessExpired = function () {
  // provjeravamo da li je nalog istekao
  const now = new Date();
  return now > this.accessExpiresAt; //vraca true ako je istekao
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); //token skriven i hesovan zbog bezbednisti i bice deklarisan u schemi

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //dodajemo koliko ce da vijedi ovo u ovom slucaju je to 10 min (racunica u milisekundama)

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
