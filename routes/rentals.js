const { Rental, validate } = require("../model/rental");
const { Movie } = require("../model/movie");
const { Customer } = require("../model/customer");

const Fawn = require("fawn");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

Fawn.init(mongoose);

// Get Customer
router.get("/", async (req, res) => {
  const rental = await Rental.find().sort({ dateout : -1 }); // Sort by date out descending
  res.send(rental);
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
//

module.exports = router;

