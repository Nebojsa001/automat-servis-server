const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

//konfiguracija

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
console.log(DB);

// const DBL = process.env.DATABASE_LOCAl;
//povizivanje mongodb
mongoose.connect(DB, {}).then(() => {
  console.log("DB connection successful!");
});
//definisanje seme

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
