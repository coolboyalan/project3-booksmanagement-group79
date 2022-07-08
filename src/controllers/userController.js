const UserModel = require("../models/userModel");
const validator = require("validator");
const isValid = require("../validators/dataValidator");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config()

const createUser = async (req, res) => {
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
        message: `Title is required and can only have these values ${arr}`,
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
          "password should must be 8 to 15 character long and must contain 1 uppercase, 1 lowercase and 1 special character",
      });

    if (address) {
      if ((message = isValid.check(address.street))) {
        return res
          .status(400)
          .send({ status: false, message: `street ${message}` });
      }
      if ((message = isValid.check(address.city))) {
        return res
          .status(400)
          .send({ status: false, message: `city ${message}` });
      }
      if ((message = isValid.check(address.pincode))) {
        return res
          .status(400)
          .send({ status: false, message: `pincode ${message}` });
      }
      let pincodeReg = /^[1-9][0-9]{5}$/;
      if (!pincodeReg.test(address.pincode)) {
        return res
          .status(400)
          .send({ status: false, message: `pincode isn't valid` });
      }
    }

    let duplicateEmail = await UserModel.findOne({ email });
    if (duplicateEmail) {
      return res
        .status(400)
        .send({ status: false, message: "Email is already registered" });
    }

    let duplicatePhone = await UserModel.findOne({ phone });
    if (duplicatePhone) {
      return res.status(400).send({
        status: false,
        message: "Phone no is already registered",
      });
    }
    let userData = await UserModel.create(data);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: userData });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    let data = req.body;
    let message;

    if ((message = isValid.body(data))) {
      return res.status(400).send({ status: false, message: message });
    }

    let { email, password } = data;

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "Email is required to login" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required to login" });
    }
    let result = await userModel.findOne({ email: email, password: password });

    if (!result) {
      return res
        .status(401)
        .send({ status: false, message: "email or password is incorrect" });
    }

    let id = result["_id"].toString()
    let token = jwt.sign({userId:id},process.env.JWT_SECRET,{expiresIn:`72h`})
    res.setHeader("x-api-key",token)

    res.status(200).send({status:true,message:"Success",data:token})
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};


module.exports = {
  createUser,
  login
};
