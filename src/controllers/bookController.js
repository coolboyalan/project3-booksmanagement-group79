const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel")
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




let getBookDetailsById = async function (req, res) {
  try {
    bookId = req.params.bookId

    if (!isValid.checkId(bookId)) return res.status(400).send({ status: false, message: "A valid bookId is required" })

    let findBook = await bookModel.findOne({ bookId });
    if (!findBook) return res.status(404).send({ status: false, message: "bookId not found in DB" })

    if (findBook.isDeleted === true) {
      res.status(404).send({ status: false, message: "book is already deleted!" });
    } else {

      let reviewData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

      if (reviewData.length == 0) return res.status(200).send({ status: true, data: { "title": findBook.title, "excerpt": findBook.excerpt, "userId": findBook.userId, "ISBN": findBook.ISBN, "category": findBook.category, "subcategory": findBook.subcategory, "reviews": findBook.reviews, "isDeleted": findBook.isDeleted, "releasedAt": findBook.releasedAt, "reviewsData": " " } })

      return res.status(200).send({ status: true, data: { "title": findBook.title, "excerpt": findBook.excerpt, "userId": findBook.userId, "ISBN": findBook.ISBN, "category": findBook.category, "subcategory": findBook.subcategory, "reviews": findBook.reviews, "isDeleted": findBook.isDeleted, "releasedAt": findBook.releasedAt, "reviewsData": reviewData } });
    }

  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}
module.exports.getBookDetailsById = getBookDetailsById






const deleteByBookId = async function (req, res) {
  try {
    let bookId = req.params.bookId
    let findBook = await bookModel.findOne({ bookId })
    if (!findBook) return res.status(404).send({ status: false, message: "bookId not found in DB" })
    if (findBook.isDeleted === true) {
      res.status(404).send({ status: false, message: "book is already deleted!" });
    } else {
      let deleteData = await bookModel.findByIdAndUpdate(
        bookId,
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
      );
      res.status(200).send({ status: true, data: deleteData });
    }
  } catch {
    return res.status(500).send({ status: false, message: err.message })
  }
}

module.exports.deleteByBookId = deleteByBookId