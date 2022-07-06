const UserModel = require('../models/userModel')
const validator = require('validator')

const isValidBody = function (body) {
    return Object.keys(body).length > 0
}

const isValidName = function (value) {
    let regEx = /^[a-zA-z.,@_&]+([\s][a-zA-Z.,@_&]+)*$/
    return regEx.test(value.trim())
}


const userValidation = async function (req, res, next) {

    try {

        let data = req.body

        let { title, name, email, phone, password, address } = data
        if (!title == "Mr" || !title == "Mrs" || !title == "Miss") return res.status(400).send({ status: false, message: "invalid title" })

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "user Details are required" })

        if (!name) return res.status(400).send({ status: false, message: "Please provide User name" })

        if (typeof (name) === 'number') return res.status(400).send({ status: false, message: "Name should not be in Number" });

        if (!isValidName(name)) { return res.status(400).send({ status: false, message: "Name is invalid" }); }

        if (!email) return res.status(400).send({ status: false, message: "Please provide User Email" })

        if (typeof (email) === 'number') return res.status(400).send({ status: false, message: "Email should not be in Number" });

        if (!validator.isEmail(email.trim())) return res.status(400).send({ status: false, message: "User Email is invalid" })

        let Email = await UserModel.findOne({ email })

        if (Email) return res.status(400).send({ status: false, message: "User Email is already registered" })

        if (!phone) return res.status(400).send({ status: false, message: "User phone no. is required" })

        const phoneRegex = /^[6-9]\d{9}$/

        if (!phoneRegex.test(phone.trim())) return res.status(400).send({ status: false, message: "phone no. should start from 6-9 and contain 10 digits" })

        let Phone = await UserModel.findOne({ phone })

        if (Phone) return res.status(400).send({ status: false, message: "user phone no. is already registered" })

        if (!password) return res.status(400).send({ status: false, message: "password is required" })

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
        if (!passwordRegex.test(password)) return res.status(400).send({ status: false, message: "password should be 8 to 15 charecter and should have 1 uppercase and 1 lowercase and 1 special character" })

        if (typeof (address.street) != "string" || typeof (address.city) != "string" || typeof (address.pincode) != "string") {
            return res.status(400).send({ status: false, message: "address street,city,pincode should be in string format" })
        }

        next()

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}
module.exports.userValidation = userValidation