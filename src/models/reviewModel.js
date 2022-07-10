const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ReviewSchema = new mongoose.Schema({
  bookId: {
    type: ObjectId,
    required: [true, "bookId is missing"],
    ref: "Book",
  },
  reviewedBy: {
    type: String,
    required: [true, "reviewer name is missing"],
    default: "Guest",
  },
  reviewedAt: {
    type: Date,
    required: [true, "review time is missing"],
  },
  rating: {
    type: Number,
    required: [true, "rating is missing"],
  },
  review: { type: String },

  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Review", ReviewSchema);
