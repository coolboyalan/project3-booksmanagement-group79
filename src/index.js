const express = require("express");
const bodyparser = require("body-parser");
const route = require("./routes/route.js");
const mongoose = require("mongoose");

const app = express();

app.use(bodyparser.json());

//DATABASE
mongoose
  .connect(
    "mongodb+srv://BishuPanda:KEzGyGmSt4rBna87@cluster0.qkauz0y.mongodb.net/group79Database?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

//ROUTES
app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
