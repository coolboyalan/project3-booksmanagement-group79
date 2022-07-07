const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const valid = require("../validators/userValidation");

//POST APIS
/*API TO CREATE USER*/
router.post("/register", valid.userValidation, userController.createUser);
/*API TO CREATE BOOK*/
router.post("/books", bookController.createBook);

//GET APIS
/* GET API TO GET ALL BOOKS, OR BY FILTER*/
router.get("/books", bookController.getBooks);
/*GET API TO GET BOOK BY ID*/
router.get("/books/:bookId", bookController.getBookDetailsById);

//DELETE APIS
/*DELETE API TO DELETE BOOK BY ID*/
router.delete("/books/:bookId", bookController.deleteByBookId);

module.exports = router;
