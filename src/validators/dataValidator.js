const mongoose = require("mongoose");

const body = (ele) => {
  if (Object.keys(ele).length) return;
  return `Please send some valid data in request body`;
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
    if (check) {
      let ele1 = [...new Set(ele)];
      if (ele1.length != ele.length) return "can't have duplicate values";
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

const pass = (ele) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  return passwordRegex.test(ele);
};

const mobile = (ele) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(ele);
};

const date = (ele) => {
  const dateRegex =
    /((20)[0-9]{2}[-](0[13578]|1[02])[-](0[1-9]|[12][0-9]|3[01]))|((20)[0-9]{2}[-](0[469]|11)[-](0[1-9]|[12][0-9]|30))|((20)[0-9]{2}[-](02)[-](0[1-9]|1[0-9]|2[0-8]))|((((20)(04|08|[2468][048]|[13579][26]))|2000)[-](02)[-]29)/g;
  return dateRegex.test(ele);
};

const isbn = (str) => {
  let sum, weight, digit, check, i;

  str = str.replace(/[^0-9X]/gi, "");

  if (str.length != 13) {
    return false;
  }

  if (str.length == 13) {
    sum = 0;
    for (i = 0; i < 12; i++) {
      digit = parseInt(str[i]);
      if (i % 2 == 1) {
        sum += 3 * digit;
      } else {
        sum += digit;
      }
    }
    check = (10 - (sum % 10)) % 10;
    return check == str[str.length - 1];
  }
};

module.exports = {
  check,
  arr,
  checkId,
  body,
  name,
  pass,
  mobile,
  date,
  isbn,
};
