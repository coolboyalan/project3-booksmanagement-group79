const UserModel = require("../models/userModel");
const createUser = async function (req, res) {
  try {
    let data = req.body;
    let userData = await UserModel.create(data);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: userData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.createUser = createUser;
