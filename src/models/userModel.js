const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is missing"],
      enum: ["Mr", "Mrs", "Miss"],
    },
    name: {
      type: String,
      required: [true, "name is missing"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone no. is missing"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is missing"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is missing"],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
