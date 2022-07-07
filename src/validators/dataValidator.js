const mongoose = require("mongoose");

const body = (ele) => {
  if(Object.keys(ele).length) return
  return `Please send some valid data in request body`
};

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
  if (ele.match("  ")) return `can't have more than one consecutive spaces'`;
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

const name = (ele) => {
  let regEx = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
  return regEx.test(ele);
};

const pass = (ele)=>{
  const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  return passwordRegex.test(ele)
}

const mobile = (ele)=>{
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(ele)
}

module.exports = {
  check,
  arr,
  checkId,
  body,
  name,
  pass,
  mobile
};
