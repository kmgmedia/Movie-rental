const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const mongoose = require("mongoose");
const express = require("express");
const app = express();

const genre = require("./routes/genres");
const customer = require("./routes/customers");
const movie = require("./routes/movies");
const rental = require("./routes/rentals");
const user = require("./routes/users");
const authRother = require('./routes/auth')

mongoose
  .connect("mongodb://localhost/rental")
  .then(() => console.log("connected to mongoDB..."))
  .catch((err) => console.log("could not connect to mongoDB...", err));

app.use(express.json());
app.use("/api/genres", genre);
app.use("/api/customers", customer);
app.use("/api/movies", movie);
app.use("/api/rentals", rental);
app.use("/api/users", user);
app.use("/api/auth", authRother);


const port = process.env.PORT ||5000;

app.listen(port, () => {
  console.log(`listening on port ${port}....`);
});




