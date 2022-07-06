// ---=+=---------=+=----------=+=----------- [ Import Modules ] ---=+=---------=+=----------=+=-----------//

const express = require('express')
const bodyparser = require('body-parser')
const route = require('./routes/route.js')
const mongoose = require('mongoose')
const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

// ---=+=---------=+=----------=+=----------- [ Connect MongoDB ] ---=+=---------=+=----------=+=-----------//

mongoose.connect("", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)

// ---=+=---------=+=----------=+=----------- [ Connect Port ] ---=+=---------=+=----------=+=-----------//

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

// ---=+=---------=+=----------=+=----------- ****************** ---=+=---------=+=----------=+=-----------//