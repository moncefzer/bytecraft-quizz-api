const express = require("express");

const usersController = require("../controllers/users");

let router = new express.Router();

router.get("/", usersController.getAll);
router.get("/leaderboard", usersController.getAllSorted);
router.post("/", usersController.add);

//submit answers with email and return [0, 1, 1] for example
//select which answers where right, update users hight score also
router.post("/submit", usersController.submit);

module.exports = router;
