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
const { createAtelier } = require("../javascripts/admin/createAtelier");
const { updateAtelier } = require("../javascripts/admin/atelier");

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
  database.query(
    `SELECT *,Date_Format(date, '%d.%m.%Y') as dateNew FROM ateliers where CURDATE() <= date ORDER by date asc;`,
    function (err, results, fields) {
      var ateliers = results;
      if(err)  ateliers = []
      database.query(
        `SELECT *,Date_Format(date, '%d.%m.%Y') as dateNew FROM ateliers where CURDATE() > date ORDER by date asc;`,
        function (err, results, fields) {
          var oldAteliers = results;
          if(err)  oldAteliers = []
  res.render("loggedin/admin/adminHome",{
    data: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret),
    ateliers: ateliers, oldAteliers: oldAteliers
  });
});

 
});

});

router.get("/participants", (req, res) => {
  database.query(
    "SELECT * FROM accounts WHERE id NOT LIKE ? ORDER by active ASC",
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
      if(!results.length > 0) return res.redirect('/admin/participants')
      res.render("loggedin/admin/participant", { participant: results[0] });
    }
  );
});

router.post("/updateParticipant", (req, res) => {
  updateParticipant(req, res, database);
});

router.get("/createAtelier/", (req, res) => {
 
      res.render("loggedin/admin/createAtelier");
});

router.post("/createAtelier/", (req, res) => {
 
  createAtelier(req, res, database)
});

router.get("/ateliers/:id", (req, res) => {
  database.query(
    "SELECT *, Date_Format(date, '%d.%m.%Y') as dateNew FROM ateliers WHERE id = ?",
    [req.params.id],
    function (err, results, fields) {
      if(!results.length > 0) return res.redirect('/admin/')
      res.render("loggedin/admin/atelierMaintenance", { atelier: results[0] });
    }
  );
});
router.post("/updateAtelier", (req, res) => {
  updateAtelier(req, res, database);

});

module.exports = router;
