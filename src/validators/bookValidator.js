const mongoose = require("mongoose");

const check = (ele) => {
  if (ele == undefined) {
    return `is missing`;
  }
  if (typeof ele != "string") {
    return `should must be a string`;
  }
  ele = ele.trim();
  if (!ele.length) {
    return `isn't valid`;
  }
};

const checkId = (id) => {
  if (mongoose.isValidObjectId(id) && id.length == 24) return true;
  return false;
};

const arr = (ele) => {
  if (ele == undefined) {
    return "is missing";
  }
  let check = Array.isArray(ele);
  if (check) {
    ele.forEach((x, y) => {
      if (typeof x != "string") check = false;
      ele[y] = x.trim();
    });
    if (!check) {
      return "array can only have string values";
    }
    return;
  }
  if (typeof ele == "string" && ele.trim().length) return;
  if (typeof ele == "string") {
    ele = ele.trim();
    if (!ele.length) return "isn't valid";
  }
  return "can only have string values or strings inside an array";
};

module.exports = {
  check,
  arr,
};
