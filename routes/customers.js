const { Customer, validate } = require("../model/customer");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(404).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(404).send(error.details[0].message);

  let customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  );
  if (!customer) res.status(404).send("the customer with the id not found");
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  let customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).send("customer with ID not found");
  res.send(customer);
});

router.get("/:id", (req, res) => {
  const customer = Customer.find((g) => g.id == parseInt(req.params.id));
  if (!customer) return res.status(404).send("The customer is not found.");
  res.send(customer);
});

module.exports = router;
