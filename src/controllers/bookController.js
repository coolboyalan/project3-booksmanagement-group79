const bookModel = require("../models/bookModel");
const isValid = require("../validators/bookValidator");

const createBook = async (req, res) => {
  try {
    let data = req.body;
    let content = Object.keys(data).length;

    if (!content) {
      return res.status(400).send({
        status: false,
        message: "Please provide some valid data in the body",
      });
    }

    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      data;

    if (isValid.check(title)) {
      return res.status(400).send({
        status: false,
        message: `title ${isValid.check(title)}`,
      });
    }
    if (isValid.check(excerpt)) {
      return res.status(400).send({
        status: false,
        message: `excerpt ${isValid.check(excerpt)}`,
      });
    }
    if (isValid.checkId(userId)) {
      return res.status(400).send({
        status: false,
        message: "A valid userId is required",
      });
    }
    if (isValid.check(ISBN)) {
      return res.status(400).send({
        status: false,
        message: `excerpt ${isValid.check(ISBN)}`,
      });
    }
    if (isValid.check(category)) {
      return res.status(400).send({
        status: false,
        message: `excerpt ${isValid.check(category)}`,
      });
    }
    if (isValid.arr(subcategory)) {
      return res.status(400).send({
        status: false,
        message: `subcategory ${isValid.arr(subcategory)}`,
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
