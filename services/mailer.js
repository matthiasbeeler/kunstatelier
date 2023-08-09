var nodemailer = require("nodemailer");
var ejs = require("ejs");
const transporter = nodemailer.createTransport({
  host: "mail.nyv.ch",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.emailUser, // generated ethereal user
    pass: process.env.emailPassword, // generated ethereal password
  },
});

exports.activationEmail = function(email, adminName,firstName){
    try {
      const filename = process.cwd() + "/emailTemplates/activation.ejs";
    ejs.renderFile(filename,{adminName: adminName, firstName: firstName}, (error, mailHTML) => {
      const mailOptions = {
        from: process.env.emailUserName, // Sender address
        to: email, // List of recipients //email
        subject: "Kunstatelier", // Subject line
        html: mailHTML,
        text: "Du wurdest auf kunstatelier.pavet.ch freigeschaltet!"
      };
      transporter.sendMail(mailOptions, (err, response) => {
          if (!err) {
            return true
          }else{
              console.log(err)
            return false
          }
        });
    });
    
  } catch (error) {
      console.log(error)
      return false
  }
  }


  exports.passwordReset = function(email,firstName,token){
    try {
      const filename = process.cwd() + "/emailTemplates/passwordForgotten.ejs";
    ejs.renderFile(filename,{link: "https://kunstatelier.pavet.ch/passwordForgotten/"+token, firstName: firstName}, (error, mailHTML) => {
      const mailOptions = {
        from: process.env.emailUserName, // Sender address
        to: email, // List of recipients //email
        subject: "Kunstatelier Passwort", // Subject line
        html: mailHTML,
        text: "Mit diesem Link kannst Du Dein Passwort zurücksetzen: "+"https://kunstatelier.pavet.ch/passwordForgotten/"+token,
      };
      transporter.sendMail(mailOptions, (err, response) => {
          if (!err) {
            return true
          }else{
              console.log(err)
            return false
          }
        });
    });
    
  } catch (error) {
      console.log(error)
      return false
  }
  }

  exports.newEntry = function(email,firstName,atelier){
    try {
      const filename = process.cwd() + "/emailTemplates/newEntry.ejs";
    ejs.renderFile(filename,{atelier: atelier, firstName: firstName}, (error, mailHTML) => {
      if(error) console.log(error);
      const mailOptions = {
        from: process.env.emailUserName, // Sender address
        to: email, // List of recipients //email
        subject: "Atelier vom " + atelier.dateNew, // Subject line
        html: mailHTML,
        text: "Du hast Dich erfolgreich für das Atelier am "+atelier.dateNew+" um "+atelier.time+" Uhr eingetragen!",
      };
      transporter.sendMail(mailOptions, (err, response) => {
          if (!err) {
            return true
          }else{
              console.log(err)
            return false
          }
        });
    });
    
  } catch (error) {
      console.log(error)
      return false
  }
  }

  exports.removeEntry = function(email,firstName,atelier){
    try {
      const filename = process.cwd() + "/emailTemplates/removeEntry.ejs";
    ejs.renderFile(filename,{atelier: atelier, firstName: firstName}, (error, mailHTML) => {
      if(error) console.log(error);
      const mailOptions = {
        from: process.env.emailUserName, // Sender address
        to: email, // List of recipients //email
        subject: "Atelier vom " + atelier.dateNew, // Subject line
        html: mailHTML,
        text: "Du hast Dich erfolgreich von dem Atelier am "+atelier.dateNew+" um "+atelier.time+" Uhr abgemeldet!",
      };
      transporter.sendMail(mailOptions, (err, response) => {
          if (!err) {
            return true
          }else{
              console.log(err)
            return false
          }
        });
    });
    
  } catch (error) {
      console.log(error)
      return false
  }
  }