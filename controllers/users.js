const db = require("../models/db_user");
require("dotenv").config({ path: "../.env" });

module.exports.getAll = async (req, res) => {
  try {
    const allUsers = await db.find(req.headers);
    console.log("LOG: getting all users", req.headers);
    res.status(200).send(allUsers);
  } catch (error) {
    console.log("LOG: Getting All users failed");
    res.status(500).send(error);
  }
};

module.exports.getAllSorted = async (req, res) => {
  try {
    //TODO: get all users (use the getAll method's script), sort users bases on their score and send
    const allUsers = await db.find({}).sort({ submit_time: "asc" });
    return res.status(200).send(allUsers);
  } catch (error) {
    console.log("LOG: Getting All users sorted failed", error);
    res.status(500).send(error);
  }
};

module.exports.add = async (req, res) => {
  try {
    //find user if exists
    const user = await db.findOne({ email: req.body.email });
    if (user) {
      console.log("LOG: adding user failed, user already exsites");
      res.status(400).send("ERROR adding user: user already existes");
    } else {
      //check token:
      console.log("Token:", process.env.TOKEN);
      if (
        verify_answer(
          req.body.token.split(", "),
          process.env.TOKEN.split(", ")
        ).reduce((a, b) => a + b) === 3
      ) {
        //save user to db
        let body = req.body;
        delete body.token;
        body.submit_time = Date.now();
        const user = await db.create(body);
        console.log("LOG: user info", user);
        res.status(200).send({ _id: user.id });
      } else {
        console.log("LOG: adding user failed, wrong token value");
        res.status(400).send("ERROR adding user: wrong token value");
      }
    }
  } catch (error) {
    console.log("LOG: adding user failed", error);
    res.status(500).send(error);
  }
};

module.exports.submit = async (req, res) => {
  try {
    if (req.body.question_id) {
      //verify specific answer
      console.log("verifying specific answer");
      console.log("answer: " + req.body.answer.split(",")[0]);
      correct_answer =
        process.env.CORRECT_ANSWERS.split(", ")[req.body.question_id - 1];
      console.log("correct_answer:", correct_answer);
      result = correct_answer == req.body.answer.split(",")[0];
      res.status(200).send({
        result: result,
        token: result
          ? process.env.TOKEN.split(", ")[req.body.question_id - 1]
          : "",
      });
    } else {
      //verify all answer
      console.log(req.body);
      let result = verify_answer(
        process.env.CORRECT_ANSWERS.split(", "),
        req.body.answer.split(", ")
      );
      console.log("answer: " + req.body.answer.split(","));
      res.status(200).send({
        result: result,
        token: result.reduce((a, b) => a + b) === 3 ? process.env.TOKEN : "",
      });
    }
  } catch (error) {
    console.log("LOG: Submitting Answer failed");
    console.log("error: ", error);
    res.status(500).send(error);
  }
};

function verify_answer(arr1, arr2) {
  const result = [0, 0, 0];
  for (let i = 0; i <= 2; i++) {
    console.log(arr1[i], arr2[i]);
    if (arr1[i] == arr2[i]) {
      result[i] = 1;
    }
  }
  return result;
}
