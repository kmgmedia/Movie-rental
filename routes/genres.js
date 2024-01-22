const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../model/genre");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});


router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(404).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });
  await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(404).send(error.details[0].message);

  let genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
  });
  if (!genre) res.status(404).send("the course with the id not found");
  res.send(genre);
});

// Handling Delete
router.delete("/:id", async (req, res) => {
  let genre = await Genre.findOneAndDelete(req.params.id);
  if (!genre) return res.status(404).send("genre with ID not found");
  res.send(genre);
});

router.get("/:id", (req, res) => {
  const genre = movies.find((g) => g.id == parseInt(req.params.id));
 
  if (!genre) return res.status(404).send("The movie is not found.");

  res.send(genre);
});

module.exports = router;