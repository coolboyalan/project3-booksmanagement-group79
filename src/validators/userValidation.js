const UserModel = require("../models/userModel");
const validator = require("validator");
const isValid = require("../validators/dataValidator");

const userValidation = async (req, res, next) => {
  try {
    let data = req.body;

    let message;

    if ((message = isValid.body(data))) {
      return res.status(400).send({
        status: false,
        message: message,
      });
    }

    let { title, name, email, phone, password, address } = data;

    let arr = ["Mr", "Miss", "Mrs"];

    if (!arr.includes(title)) {
      return res.status(400).send({
        status: false,
        message:
          "Title is required and can only have these values : Mr, Mrs, Miss",
      });
    }
    if ((message = isValid.check(name))) {
      return res
        .status(400)
        .send({ status: false, message: `name ${message}` });
    }
    name = name.trim();

    if (!isValid.name(name)) {
      return res.status(400).send({
        status: false,
        message: "Name is invalid, please enter a valid name",
      });
    }
    if ((message = isValid.check(email))) {
      return res
        .status(400)
        .send({ status: false, message: `email ${message}` });
    }
    email = email.trim();

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "User Email is invalid" });
    }
    if ((message = isValid.check(phone))) {
      return res
        .status(400)
        .send({ status: false, message: `phone ${message}` });
    }
    phone = phone.trim();

    if (!isValid.mobile(phone)) {
      return res.status(400).send({
        status: false,
        message:
          "phone no. should start from 6-9 and can only contain numbers with a fixed length of 10 digits",
      });
    }
    if ((message = isValid.check(password))) {
      return res
        .status(400)
        .send({ status: false, message: `password ${message}` });
    }
    if (!isValid.pass(password))
      return res.status(400).send({
        status: false,
        message:
          "password should must be 8 to 15 charecter long and muat contain 1 uppercase, 1 lowercase and 1 special character",
      });

    if (address.street) {
      if ((message = isValid.check(address.street))) {
        return res
          .status(400)
          .send({ status: false, message: `street ${message}` });
      }
    }

    let Email = await UserModel.findOne({ email });
    let Phone = await UserModel.findOne({ phone });

    if (Phone)
      return res.status(400).send({
        status: false,
        message: "user phone no. is already registered",
      });
    if (Email) {
      return res
        .status(400)
        .send({ status: false, message: "User Email is already registered" });
    }
    next();
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.userValidation = userValidation;
