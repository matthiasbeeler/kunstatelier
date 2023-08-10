var express = require('express');
const { login, signup } = require('../javascripts/auth');
const { database } = require('../services/database');
var router = express.Router();
var bouncer = require ("express-bouncer")(300000, 9000000, 7);
const jwt = require("jsonwebtoken");
const { passwordForgottenEmail, passwordForgottenUpdate } = require('../javascripts/passwordForgotten');
const cron = require('node-cron');
const { sendReminder } = require('../javascripts/sendReminder');

bouncer.whitelist.push ("127.0.0.1");
bouncer.blocked = function (req, res, next, remaining)
{
    res.json({success: false, message: "Es wurden zu viele Anfragen gesendet. Bitte warte " + Math.round(remaining / 1000 / 60) + " Minuten"});
};

router.all(["/", "/signup"], function (req, res, next) {
  try {
  if(req.cookies.NyvAuth){
    console.log(jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).loggedin)
    if(jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).loggedin) return res.redirect('/user')
  }
  if(!req.cookies.NyvAuth){
    if(!jwt.verify(req.cookies.NyvAuth, process.env.jwtSecret).loggedin) return next()
  }
  
    
} catch (error) {
    next()
    console.log(error)
}
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/passwordForgotten', function(req, res, next) {
  res.render('passwordForgotten');
});

router.post('/passwordForgottenEmail', function(req, res, next) {
  passwordForgottenEmail(req, res, database)
});

router.get('/passwordForgotten/:token', function(req, res, next) {
  res.render('passwordForgottenChange', {token: req.params.token});
});


router.post('/passwordForgottenUpdate', function(req, res, next) {
  passwordForgottenUpdate(req, res, database)
});

router.post('/login', function(req, res, next) {
  login(req,res,database,bouncer)
});

router.get('/signup', function(req, res, next) {
  res.render('register');
});

router.post('/signup', function(req, res, next) {
  signup(req, res, database,bouncer)
});

cron.schedule('0 52 03 * * *', function() {
sendReminder(database)
});


setInterval(function () {
  database.query('SELECT 1')
}, 10000);

module.exports = router;
