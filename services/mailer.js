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