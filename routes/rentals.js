const { Rental, validate } = require("../model/rental");
const { Movie } = require("../model/movie");
const { Customer } = require("../model/customer");
// const _ = require("lodash");
const Fawn = require("fawn");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

Fawn.init(mongoose);

// Get Customer
router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateout");
  res.send(rental);
});

router.get("/:id", async (req, res) => {
  let movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("The movie is not found.");
  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Invalid customer");
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Invalid Movie");
  if (movie.numberInStock === 0) return res.send("Movie not in stock");
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  };
});

// router.post("/", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const customer = await Customer.findById(req.body.customerId);
//   if (!customer) return res.status(400).send("Invalid customer.");

//   const movie = await Movie.findById(req.body.movieId);
//   if (!movie) return res.status(400).send("Invalid movie.");

//   if (movie.numberInStock === 0)
//     return res.status(400).send("Movie not in stock.");

//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const rental = await Rental.create(
//       [
//         {
//           customer: _.pick(customer, ["_id", "name", "phone"]),
//           movie: _.pick(movie, ["_id", "title", "dailyRentalRate"]),
//         },
//       ],
//       { session }
//     );

//     await Movie.findByIdAndUpdate(
//       movie._id,
//       { $inc: { numberInStock: -1 } },
//       { session }
//     );

//     await session.commitTransaction();
//     res.send(rental);
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).send("Something went wrong.");
//   }
//   session.endSession();
// });

module.exports = router;

