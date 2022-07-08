const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");

//POST APIS
/*API TO CREATE USER*/
router.post("/register", userController.createUser);
/*API TO CREATE BOOK*/
router.post("/books", bookController.createBook);
/*API TO LOGIN*/
router.post("/login", userController.login)

//GET APIS
/* GET API TO GET ALL BOOKS, OR BY FILTER*/
router.get("/books", bookController.getBooks);
/*GET API TO GET BOOK BY ID*/
router.get("/books/:bookId", bookController.getBookDetailsById);

//PUT APIS
/*API TO UPDATE A BOOK BY ID*/
router.put("/books/:bookId", bookController.updateBookById);
//DELETE APIS
/*DELETE API TO DELETE BOOK BY ID*/
router.delete("/books/:bookId", bookController.deleteByBookId);

module.exports = router;
