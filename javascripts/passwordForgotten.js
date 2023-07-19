const jwt = require("jsonwebtoken");
const crypto = require("crypto");
var validator = require("validator");
const { passwordReset } = require("../services/mailer");

exports.passwordForgottenEmail = function (request, response, database) {
  try {
    if (!request.body.email)
      return response.json({ success: false, error: 1, message: "fields" });
    var input = request.body.email.trim().replace(/\s{2,}/g, " ");
    if (validator.isEmpty(input))
      return response.json({ success: false, error: 1, message: "Fields" });
    database.query(
      `SELECT * FROM accounts WHERE email=?`,
      [input],
      function (err, results, fields) {
        if (err) console.log(err);
        if (err)
          return response.json({ success: false, error: 3, message: "Error" });
        if (results.length > 0) {
          const token = jwt.sign(
            {
              id: results[0].id,
              email: results[0].email,
            },
            process.env.jwtSecret,
            { expiresIn: "30m" }
          );
          passwordReset(results[0].email, results[0].firstName, token);
          if (!err)
            return response.json({ success: true, action: "passwordreset" });
        } else {
          if (!err)
            return response.json({ success: true, action: "passwordreset" });
          if (err) console.log(err);
          if (err)
            return response.json({
              success: false,
              error: 3,
              message: "error",
            });
        }
      }
    );
  } catch (error) {
    if (error) console.log(error);
    if (error)
      return response.json({ success: false, error: 5, message: "error" });
  }
};

exports.passwordForgottenUpdate = function (request, response, database) {
  try {
    if (request.body.password !== request.body.passwordCheck)
      return response.json({
        success: false,
        error: 1,
        message: "Passwords don't match",
      });
      console.log(request.body)
    jwt.verify(request.body.token, process.env.jwtSecret, (err, result) => {
      if (err) console.log(err);
      if (err)
        return response.json({
          success: false,
          error: 3,
          message: "Token invalid",
        });

      var tokenData = jwt.verify(request.body.token, process.env.jwtSecret);

      database.query(
        "UPDATE accounts SET password = ? WHERE id = ? AND email = ?",
        [
          crypto
            .createHash("sha256")
            .update(request.body.password + process.env.salt)
            .digest("hex"),
          tokenData.id,
          tokenData.email,
        ],
        function (err, results, fields) {
          if (!err) return response.json({ success: true });
          if (err) console.log(err);
          if (err) return response.json({ success: false, error: 4 });
        }
      );
    });
  } catch (error) {
    if (error) console.log(error);
    if (error) return response.json({ success: false, error: 4 });
  }
};
