const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel");
const isValid = require("../validators/dataValidator");

const createBook = async (req, res) => {
  try {
    let data = req.body;
    let message;

    if ((message = isValid.body(data))) {
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
    if ((message = isValid.check(releasedAt))) {
      return res.status(400).send({
        status: false,
        message: `released Date ${message}`,
      });
    }
    if (!isValid.date(releasedAt)) {
      return res.status(400).send({
        status: false,
        message:
          "releasedAt date should must be a string in the format YYYY-MM-DD",
      });
    }
    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({
        status: false,
        message: `There is no user with this ${userId} userId`,
      });
    }
    let duplicate = await bookModel.findOne({
      $or: [{ title: title }, { ISBN: ISBN }],
    });
    if (duplicate) {
      return res.status(409).send({
        status: false,
        message: `Both Title and ISBN should must be unique`,
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

const getBooks = async (req, res) => {
  try {
    let queries = Object.keys(req.query);
    if (queries.length) {
      let data = req.query;
      let allowedfilters = ["userId", "category", "subcategory"];
      let filters = allowedfilters.filter((x) => queries.includes(x));

      if (!filters.length) {
        return res.status(400).send({
          status: false,
          message: `one of these filters are required ${allowedfilters}`,
        });
      }
      if (filters.includes("userId")) {
        if (!isValid.checkId(data.userId)) {
          return res.status(400).send({
            status: false,
            message: "UserId in query params isn't valid",
          });
        }
      }
      let search = {};
      filters.forEach((x) => {
        if (allowedfilters.includes(x)) {
          search[x] = data[x];
        }
      });
      search.isDeleted = false;
      let result = await bookModel
        .find(search)
        .select({
          title: 1,
          excerpt: 1,
          userId: 1,
          category: 1,
          releasedAt: 1,
          reviews: 1,
        })
        .sort({ title: 1 });

      if (!result.length) {
        return res.status(404).send({
          status: false,
          message: "No matching books with this filter",
        });
      }
      return res.status(200).send({
        status: true,
        message: `Books list`,
        data: result,
      });
    }
    let data = await bookModel
      .find({ isDeleted: false })
      .select({
        title: 1,
        excerpt: 1,
        userId: 1,
        category: 1,
        releasedAt: 1,
        reviews: 1,
      })
      .sort({ title: 1 });

    if (!data.length) {
      return res
        .status(404)
        .send({ status: false, message: "books not found" });
    }
    return res.status(200).send({
      status: true,
      message: `Books list`,
      data: data,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const getBookDetailsById = async (req, res) => {
  try {
    let bookId = req.params.bookId;

    if (!isValid.checkId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "BookId in path params isn't valid" });
    }

    let findBook = await bookModel.findById(bookId).lean();

    if (!findBook) {
      return res
        .status(404)
        .send({ status: false, message: "There's no book with this id" });
    }
    if (findBook.isDeleted) {
      return res
        .status(400)
        .send({ status: false, message: "book is already deleted!" });
    }

    let reviewData = await reviewModel
      .find({ bookId: bookId, isDeleted: false })
      .select({
        bookId: 1,
        reviewedBy: 1,
        reviewedAt: 1,
        rating: 1,
        review: 1,
      });

    delete findBook.ISBN;
    findBook["reviewsData"] = reviewData;

    return res
      .status(200)
      .send({ status: true, message: "Books list", data: findBook });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const deleteByBookId = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    if (!bookId) {
      return res.status(400).send({
        status: false,
        message: "BookId is missing in request path params",
      });
    }
    if (!isValid.checkId(bookId)) {
      return res.status(400).send({
        status: false,
        message: "BookId in the path params isn't valid",
      });
    }
    let findBook = await bookModel.findOne({ bookId });
    if (!findBook)
      return res
        .status(404)
        .send({ status: false, message: "bookId not found in DB" });
    if (findBook.isDeleted) {
      res
        .status(202)
        .send({ status: false, message: "This book is already deleted" });
    } else {
      await bookModel.findByIdAndUpdate(
        bookId,
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
      );
      res.status(200).send({
        status: true,
        message: `Book with the id "${bookId}" has been deleted successfully`,
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: false, message: err.message });
  }
};

const updateBookById = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    let data = req.body;
    let message;

    if (!isValid.checkId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "BookId in path params isn't valid" });
    }
    if ((message = isValid.body(data))) {
      return res.status(400).send({ status: false, message: message });
    }
    for (let key in data) {
      if (key == "title" || key == "ISBN") {
        let result = await bookModel.findOne({ [key]: data[key] });
        if (result) message = key;
      }
    }
    if (message) {
      return res
        .status(409)
        .send({ status: false, message: `${message} should must be unique` });
    }
    let { title, excerpt, ISBN, releasedAt } = data;
    let update = {};

    if (title) {
      if ((message = isValid.check(title))) {
        return res.status(400).send({
          status: false,
          message: `title ${message}`,
        });
      }
      update.title = title;
    }
    if (excerpt) {
      if ((message = isValid.check(excerpt))) {
        return res.status(400).send({
          status: false,
          message: `excerpt ${message}`,
        });
      }
      update.excerpt = excerpt;
    }
    if (ISBN) {
      if ((message = isValid.check(ISBN))) {
        return res.status(400).send({
          status: false,
          message: `ISBN ${message}`,
        });
      }
      update.ISBN = ISBN;
    }
    if (releasedAt) {
      if (!isValid.date(releasedAt)) {
        return res.status(400).send({
          status: false,
          message:
            "releasedAt date should must be a string in the format YYYY-MM-DD",
        });
      }
      update.releasedAt = releasedAt;
    }
    let result = await bookModel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      update,
      { new: true }
    );
    if (!result) {
      return res.status(404).send({
        status: false,
        message: "No book with this Id or the book is already deleted",
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: result });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookDetailsById,
  deleteByBookId,
  updateBookById,
};
