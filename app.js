const mongoose = require("mongoose");
const express = require('express');
const app = express();
const genre = require('./routes/genres');

mongoose
  .connect("mongodb://localhost/rental")
  .then(() => console.log("connected to mongoDB..."))
  .catch((err) => console.log("could not connect to mongoDB...", err));

app.use(express.json());
app.use('/api/genres', genre)

const port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`listening on port ${port}....`)});