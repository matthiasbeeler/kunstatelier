var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const { updateImage } = require('../javascripts/updateImage');
const { database } = require('../services/database');
const { validate } = require("uuid");
const fs = require('fs')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('loggedin/home', {firstName: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).firstName})
});

router.get('/account', function(req, res, next) {
  res.render('loggedin/account', {data: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret)})
});

router.get('/account/personalDetails', function(req, res, next) {
  res.render('loggedin/account/personalDetails', {data: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret)})
});

router.get('/account/profileImage', function(req, res, next) {
  res.render('loggedin/account/profileImage', {data: jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret)})
});

router.post("/account/profileImage", function (req, res) {
  updateImage(req, res, database);
});

router.all('/uploads/profileImages/:id', function(req, res, next) {
  try {
  var imagePath;
  if(validate(req.params.id.split(".")[0]) && req.params.id.split(".").length == 2 && req.params.id.split(".")[1] == "webp") {
    imagePath = req.params.id;
  }else{
    imagePath = "0"
  }
  fs.readFile(process.cwd()+ "/uploads/profileImages/"+imagePath, (err, data) => {
    if (!err && data) {
      return res.sendFile(process.cwd()+ "/uploads/profileImages/"+imagePath)
    }else{
      return res.sendFile(process.cwd()+ "/public/images/accountIcon.svg")    }
  })

    
} catch (error) {
    console.log(error)
}
});

router.get("/logout", (req, res) => {
  res.clearCookie("NyvAuth");
  res.redirect("/");
});

module.exports = router;
