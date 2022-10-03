const mongoose = require("mongoose");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    default: "<UKN>",
  },
  email: {
    type: String,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  submit_time: {
    type: Number,
  },
});

const Users = mongoose.model("wd_user", userSchema);

module.exports = Users;
