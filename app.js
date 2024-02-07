const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require('config');

const express = require("express");
const app = express();

const genre = require("./routes/genres");
const customer = require("./routes/customers");
const movie = require("./routes/movies");
const rental = require("./routes/rentals");
const user = require("./routes/users");
const authRother = require('./routes/auth')



const mongoose = require("mongoose");



mongoose
  .connect('mongodb://127.0.0.1:27017/movierent')
  .then(() => console.log("connected to mongoDB..."))
  .catch((err) => console.log("could not connect to mongoDB...", err));

  if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR:  jwtPrivateKey is undefined!');
    process.exit(1);
  }
  // parse requests of content type - application/x-www-form-urlencoded



app.use(express.json());
app.use("/api/genres", genre);
app.use("/api/customers", customer);
app.use("/api/movies", movie);
app.use("/api/rentals", rental);
app.use("/api/users", user);
app.use("/api/auth", authRother);


const port = process.env.PORT ||3000;

app.listen(port, () => {
  console.log(`listening on port ${port}....`);
});
