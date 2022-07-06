const mongoose = require('mongoose')

// ---=+=---------=+=----------=+=----------- [ user Model ] ---=+=---------=+=----------=+=-----------//

const UserSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true,"title is missing"],
        enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
        type: String,
        required: [true,"name is missing"]
    },
    phone: {
        type: String,
        required: [true,"Phone no. is missing"],
        unique: true
    },
    email: {
        type: String,
        required: [true,"email is missing"],
        unique: true
    },
    password: {
        type: String,
        required: [true,"password is missing"]
    },
    address: {
        street: String ,
        city: String ,
        pincode: String
    }

},
    { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
