const UserModel = require("../models/userModel");
const validator = require("validator");

const isValidBody = (body) => {
  return Object.keys(body).length > 0;
};

const isValidName = (value) => {
  let regEx = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
  return regEx.test(value);
};

const userValidation = async (req, res, next) => {
  try {
    let data = req.body;

    let { title, name, email, phone, password, address } = data;

    if (!isValidBody(data)) {
      return res.status(400).send({
        status: false,
        message: "User details are required in order to create a user",
      });
    }
    let arr = ["Mr", "Miss", "Mrs"];

    if (!arr.includes(title)) {
      return res.status(400).send({
        status: false,
        message:
          "Title is required and can only have these values : Mr, Mrs, Miss",
      });
    }
    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide User name" });
    }
    name = name.trim();

    if (!isValidName(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name is invalid" });
    }

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide User Email" });
    }
    if (!validator.isEmail(email.trim())) {
      return res
        .status(400)
        .send({ status: false, message: "User Email is invalid" });
    }

    if (!phone)
      return res
        .status(400)
        .send({ status: false, message: "User phone no. is required" });

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone.trim()))
      return res.status(400).send({
        status: false,
        message: "phone no. should start from 6-9 and contain 10 digits",
      });

    let Phone = await UserModel.findOne({ phone });

    if (Phone)
      return res.status(400).send({
        status: false,
        message: "user phone no. is already registered",
      });

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    if (!passwordRegex.test(password))
      return res.status(400).send({
        status: false,
        message:
          "password should be 8 to 15 charecter and should have 1 uppercase and 1 lowercase and 1 special character",
      });

    if (
      typeof address.street != "string" ||
      typeof address.city != "string" ||
      typeof address.pincode != "string"
    ) {
      return res.status(400).send({
        status: false,
        message: "address street,city,pincode should be in string format",
      });
    }

    let Email = await UserModel.findOne({ email });

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
