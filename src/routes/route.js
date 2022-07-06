const express = require('express');
const router = express.Router();
const UserControl = require('../controllers/userController')
const valid = require('../validators/userValidation')


// ---=+=---------=+=----------=+=----------- [ Route APIs ] ---=+=---------=+=----------=+=-----------//

router.post("/register", valid.userValidation, UserControl.createUser)


module.exports = router

// ---=+=---------=+=----------=+=----------- ****************** ---=+=---------=+=----------=+=-----------//