const bookModel = require("../models/bookModel");
const isValid = require("../validators/dataValidator");

const createBook = async (req, res) => {
  try {
    let data = req.body;
    let message;

    if (message = isValid.body(data)) {
      return res.status(400).send({
        status: false,
        message: message,
      });
    }

    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      data;


    if ((message = isValid.check(title))) {
      return res.status(400).send({
        status: false,
        message: `title ${message}`,
      });
    }
    if ((message = isValid.check(excerpt))) {
      return res.status(400).send({
        status: false,
        message: `excerpt ${message}`,
      });
    }
    if (!isValid.checkId(userId)) {
      return res.status(400).send({
        status: false,
        message: "A valid userId is required",
      });
    }
    if ((message = isValid.check(ISBN))) {
      return res.status(400).send({
        status: false,
        message: `ISBN ${message}`,
      });
    }
    if ((message = isValid.check(category))) {
      return res.status(400).send({
        status: false,
        message: `category ${message}`,
      });
    }
    if ((message = isValid.arr(subcategory))) {
      return res.status(400).send({
        status: false,
        message: `subcategory ${message}`,
      });
    }
    if (!isValid.check(releasedAt)) {
      return res.status(400).send({
        status: false,
        message: "A valid releaseDate is required",
      });
    }

    let result = await bookModel.create(data);
    res.status(201).send({
      status: true,
      message: "Success",
      data: result,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createBook,
};
