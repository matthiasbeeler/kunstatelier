var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { updateImage } = require("../javascripts/updateImage");
const { database } = require("../services/database");
const { validate } = require("uuid");
const fs = require("fs");
const { updateEmail } = require("../javascripts/updateEmail");
const { updatePassword } = require("../javascripts/updatePassword");
const {
  checkActivationStatus,
} = require("../javascripts/checkActivationStatus");
const { updateParticipant } = require("../javascripts/admin/participant");

router.all("*", function (req, res, next) {
  try {
    if (req.cookies.NyvAuth) {
      if (
        jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).loggedin &&
        jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).admin
      )
        return next();
    }
    if (!req.cookies.NyvAuth) {
      if (!jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).loggedin)
        return res.redirect("/");
    }
  } catch (error) {
    console.log(error);

    return res.redirect("/");
  }
});

router.get("/", (req, res) => {
  res.render("loggedin/admin/adminHome");
});

router.get("/participants", (req, res) => {
  database.query(
    "SELECT * FROM accounts WHERE id NOT LIKE ?",
    [jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).id],
    function (err, results, fields) {
      res.render("loggedin/admin/participants", { participants: results });
    }
  );
});

router.get("/participants/:id", (req, res) => {
  database.query(
    "SELECT * FROM accounts WHERE id = ?",
    [req.params.id],
    function (err, results, fields) {
      res.render("loggedin/admin/participant", { participant: results[0] });
    }
  );
});

router.post("/updateParticipant", (req, res) => {
  updateParticipant(req, res, database);
});

module.exports = router;
