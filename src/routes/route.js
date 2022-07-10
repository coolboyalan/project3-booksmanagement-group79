const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const mid = require("../middlewares/auth")

//POST APIS
/*API TO CREATE USER*/
router.post("/register", userController.createUser);
/*API TO CREATE BOOK*/
router.post("/books", bookController.createBook);
/*API TO ADD A REVIEW*/
router.post("/books/:bookId/review", reviewController.addReview);
/*API TO LOGIN*/
router.post("/login", userController.login);

//GET APIS
/* GET API TO GET ALL BOOKS, OR BY FILTER*/
router.get("/books", mid.auth,bookController.getBooks);
/*GET API TO GET BOOK BY ID*/
router.get("/books/:bookId", mid.auth, bookController.getBookDetailsById);

//PUT APIS
/*API TO UPDATE A BOOK BY ID*/
router.put("/books/:bookId", bookController.updateBookById);
/*API TO UPDATE A BOOK REVIEW USING BOOKID AND REVIEWID*/
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);

//DELETE APIS
/*DELETE API TO DELETE BOOK BY ID*/
router.delete("/books/:bookId", bookController.deleteByBookId);
/*DELETE API TO DELETE A REVIEW USING BOOK AND REVIEWID*/
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);

module.exports = router;
