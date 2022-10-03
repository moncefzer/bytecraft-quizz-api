//import express and type
const express = require("express");
const mongoose = require("mongoose");

//import .env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//global variables (including app)
CONNECTIONURL = process.env.CONNECTIONURL;
PORT = process.env.PORT;
app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//use routes in app

const usersRoute = require("./routes/users");
app.use("/users", usersRoute);

//define GET / home request response
app.get("/", function (req, res) {
  res.status(200).send("This is Q/A API");
});

app.listen(PORT, function () {
  console.log(`server running on localhost:${PORT}`);
  //connectin to mongooDB
  db = mongoose.connect(CONNECTIONURL);
  mongoose.connection
    .once("open", function () {
      console.log("Connection established with mongoDB");
    })
    .on("error", function (error) {
      console.log("Error: ", error);
    });
});
//
