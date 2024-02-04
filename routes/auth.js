const Joi = require("joi");
const { User } = require("../model/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// for a authenticating user
// router.post('/', async (req, res) => {
//     const {error} =  User.validate(req.body);
//     if(error){
//         return res.status(400).send(error.details[0].message);
//     }
//      let user = await User.findOne({email: req.body.email});
//       // check if the email is already registered or not
//      if(!user){
//          return res.status(400).send('Email is invalid');
//      }
//      const validPassword = await bcrypt.compare(req.body.password , user.password);
//      if (!validPassword ) {
//        return res.status(401).send('Invalid Password!');
//      }
//      // create token
//      const token = await user.generateAuthToken()
//      // return response with status ok and added token to header
//      res.cookie('jwt' , token , {httpOnly : true}).send();
// })

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or Password!");
  await user.save();
  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(225).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(req, schema);
}


module.exports = router;
