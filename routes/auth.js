const Joi = require("joi");
const { User } = require("../model/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

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
  res.send(true);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(225).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(req, schema);
}

// // logout route
// router.delete("/", auth, async (req, res) => {
//   // revoke the refresh token on logging out
//   req.user.revokeTokens(req.token.refreshTokenId);
//   res.status(200).send();
// });

// function auth(req, res, next) {
//   const token = req.header("Authorization");
//   User.authenticateToken(token)
//     .then((user) => {
//       req.user = user;
//       req.token = token;
//       next();
//     })
//     .catch((e) => {
//       res.status(403).send("You are not authorized");
//     });
// }

module.exports = router;
