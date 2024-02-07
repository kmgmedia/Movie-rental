const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 225,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

// Validation
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const Schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(225).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, Schema);
}

exports.User = User;
exports.validate = validateUser;
