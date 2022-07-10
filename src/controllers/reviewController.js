const reviewModel = require("../models/reviewModel");
const isValid = require("../validators/dataValidator");
const bookModel = require("../models/bookModel");

const addReview = async (req, res) => {
  try {
    let data = req.body;
    let bookId = req.params.bookId;
    let message;

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "BookId is missing in query params" });
    }
    if (!isValid.checkId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "BookId in path params isn't valid" });
    }
    if ((message = isValid.body(data))) {
      return res.status(400).send({ status: false, message: message });
    }

    let { review, rating, reviewedBy } = data;
    let reviewData = {};

    if (reviewedBy) {
      if ((message = isValid.check(reviewedBy))) {
        return res
          .status(400)
          .send({ status: false, message: `reviewer name ${message}` });
      }
      if (!isValid.name(reviewedBy)) {
        return res.status(400).send({
          status: false,
          message: "Reviewer name is invalid, please enter a valid name",
        });
      }
      reviewData["reviewedBy"] = reviewedBy;
    }
    if (!rating) {
      return res
        .status(400)
        .send({ status: false, message: "Rating in the review is missing." });
    }
    if (!(typeof rating == "number" && rating <= 5 && rating >= 1)) {
      return res.status(400).send({
        status: false,
        message: "Rating can only be between 1 & 5 and should must be a Number",
      });
    }
    reviewData["rating"] = rating;
    reviewData["reviewedAt"] = new Date();
    reviewData["bookId"] = bookId;

    if (review) {
      if ((message = isValid.check(review))) {
        return res
          .status(400)
          .send({ status: false, message: `review ${message}` });
      }
      reviewData["review"] = review;
    }
    let book = await bookModel
      .findOneAndUpdate(
        { _id: bookId, isDeleted: false },
        { $inc: { reviews: 1 } },
        { new: true }
      )
      .lean();
    if (!book) {
      return res.status(404).send({
        status: false,
        message: "No book with this id or already deleted",
      });
    }

    await reviewModel.create(reviewData);
    let reviews = await reviewModel.find({ bookId: bookId });
    book.reviewsData = reviews;

    return res
      .status(201)
      .send({ status: true, message: "Success", data: book });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const updateReview = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    let data = req.body;
    let message;

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is missing" });
    }
    if (!reviewId) {
      return res
        .status(400)
        .send({ status: false, message: "reviewId is missing" });
    }
    if ((message = isValid.body(data))) {
      return res.status(400).send({ status: false, message: message });
    }
    if (!isValid.checkId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "bookId in path params isn't valid" });
    }
    if (!isValid.checkId(reviewId)) {
      return res.status(400).send({
        status: false,
        message: "reviewid in path params isn't valid",
      });
    }

    let oldReview = await reviewModel.findById(reviewId);
    if (!oldReview) {
      return res
        .status(400)
        .send({ status: false, message: "there is no review with this id" });
    }
    if (oldReview.isDeleted) {
      return res.status(400).send({
        status: false,
        message: "this review is already deleted",
      });
    }
    if (oldReview.bookId != bookId) {
      return res.status(403).send({
        status: false,
        message: "this bookId and reviewId doesn't belong to each other",
      });
    }

    let book = await bookModel
      .findOne({ _id: bookId, isDeleted: false })
      .lean();

    if (!book) {
      return res.status(404).send({
        status: false,
        message: "there is no book with this id or already deleted",
      });
    }

    let { review, reviewedBy, rating } = data;
    let updateData = {};

    if (reviewedBy) {
      if ((message = isValid.check(reviewedBy))) {
        return res
          .status(400)
          .send({ status: false, message: `reviewer name ${message}` });
      }
      if (!isValid.name(reviewedBy)) {
        return res.status(400).send({
          status: false,
          message: "Reviewer name is invalid, please enter a valid name",
        });
      }
      updateData["reviewedBy"] = reviewedBy;
    }
    if (rating) {
      if (!(typeof rating == "number" && rating <= 5 && rating >= 1)) {
        return res.status(400).send({
          status: false,
          message:
            "Rating can only be between 1 & 5 and should must be a Number",
        });
      }
      updateData["rating"] = rating;
    }
    if (review) {
      if ((message = isValid.check(review))) {
        return res
          .status(400)
          .send({ status: false, message: `review ${message}` });
      }
      updateData["review"] = review;
    }

    await reviewModel.findOneAndUpdate({ _id: reviewId }, updateData);
    let reviews = await reviewModel.find({ bookId: bookId });
    book.reviewsData = reviews;
    return res
      .status(200)
      .send({ status: true, message: "Success", data: book });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;

    if (!isValid.checkId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "bookId in path params isn't valid" });
    }
    if (!isValid.checkId(reviewId)) {
      return res.status(400).send({
        status: false,
        message: "reviewId in path params isn't valid",
      });
    }

    let review = await reviewModel.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .send({ status: false, message: "there is no review with this id" });
    }
    if (review.isDeleted) {
      return res
        .status(404)
        .send({ status: false, message: "this review is already deleted" });
    }
    if (review.bookId != bookId) {
      return res.status(403).send({
        status: false,
        message: "this bookId and reviewId doesn't belong to each other",
      });
    }

    let book = await bookModel.findById(bookId);
    if (book.isDeleted) {
      return res
        .status(404)
        .send({ status: false, message: "this book has already been deleted" });
    }
    if (!book) {
      return res
        .status(404)
        .send({ status: false, message: "there is no book with this id" });
    }

    await reviewModel.findByIdAndUpdate(reviewId, { isDeleted: true });
    await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } });
    res.status(200).send({ status: true, message: "Success" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
};
