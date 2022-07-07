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

router.get("/books/:bookId", bookController.getBookDetailsById)

router.delete("/books/bookId", bookController.deleteByBookId)

module.exports = router;
