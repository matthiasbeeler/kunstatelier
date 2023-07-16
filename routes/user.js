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

router.all("*", function (req, res, next) {
  try {
    if (req.cookies.NyvAuth) {
      if (jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).loggedin)
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

router.post("/checkActivationStatus", function (req, res, next) {
  if (jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).active)
    return res.redirect("/user");
  checkActivationStatus(req, res, database);
});

router.get("/activationPending", function (req, res, next) {
  if (jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).active)
    return res.redirect("/user");
  res.render("loggedin/account/activationPending", {
    data: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret),
  });
});
router.all("*", function (req, res, next) {
  if (!jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).active) return res.redirect("/user/activationPending");
  next();
});
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("loggedin/home", {
    data: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret),
  });
});

router.get("/account", function (req, res, next) {
  database.query(
    "SELECT * FROM accounts WHERE id = ?",
    [jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).id],
    function (err, results, fields) {
      var userData = results;
      var token = jwt.sign(
        {
          email: userData[0].email,
          id: userData[0].id,
          loggedin: true,
          active: userData[0].active,
          firstName: userData[0].firstName,
          lastName: userData[0].lastName,
          class: userData[0].class,
          admin: userData[0].admin,
          registrationTimestamp: userData[0].registrationTimestamp,
          profileImageUpdate: userData[0].profilePictureUpdate,
        },
        process.env.jwtSecret
      );
      res.cookie("NyvAuth", token, {
        maxAge: 9999 * 60 * 60 * 1000,
        httpOnly: false,
        overwrite: true,
      });
      return res.render("loggedin/account", {
        data: jwt.verify(token, process.env.jwtSecret),
      });
    }
  );
});

router.get("/account/personalDetails", function (req, res, next) {
  res.render("loggedin/account/personalDetails", {
    data: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret),
  });
});

router.get("/account/profileImage", function (req, res, next) {
  res.render("loggedin/account/profileImage", {
    data: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret),
  });
});

router.post("/account/profileImage", function (req, res) {
  updateImage(req, res, database);
});

router.get("/account/emailUpdate", function (req, res, next) {
  res.render("loggedin/account/emailUpdate", {
    data: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret),
  });
});

router.post("/account/emailUpdate", function (req, res, next) {
  updateEmail(req, res, database);
});

router.get("/account/password", function (req, res, next) {
  res.render("loggedin/account/passwordUpdate", {
    data: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret),
  });
});

router.post("/account/password", function (req, res, next) {
  updatePassword(req, res, database);
});

router.all("/uploads/profileImages/:id", function (req, res, next) {
  try {
    var imagePath;
    if (
      validate(req.params.id.split(".")[0]) &&
      req.params.id.split(".").length == 2 &&
      req.params.id.split(".")[1] == "webp"
    ) {
      imagePath = req.params.id;
    } else {
      imagePath = "0";
    }
    fs.readFile(
      process.cwd() + "/uploads/profileImages/" + imagePath,
      (err, data) => {
        if (!err && data) {
          return res.sendFile(
            process.cwd() + "/uploads/profileImages/" + imagePath
          );
        } else {
          return res.sendFile(process.cwd() + "/public/images/accountIcon.svg");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("NyvAuth");
  res.redirect("/");
});

module.exports = router;
