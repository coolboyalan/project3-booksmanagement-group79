const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");

const auth = (req, res, next) => {
  try {
    let token = req.headers["x-api-key"];
    let bookId = req.params.bookId;

    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "token is missing in headers" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(400).send({ status: false, message: err.message });
      }
      if (req.method == "GET") return next();

      let book = await bookModel.findById(bookId);
      if (!book) {
        return res
          .status(404)
          .send({ status: false, message: "there is no book with this id" });
      }
      if (book.userId != payload.userId) {
        return res.status(403).send({
          status: false,
          message: "you ain't authorized to perform this action",
        });
      }
      next()
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  auth,
};
