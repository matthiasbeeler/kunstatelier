const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.updatePassword = function (request, response, database) {
  var jwtData = jwt.verify(request.cookies.NyvAuth, process.env.jwtSecret);
  var newPassword = request.body.newPassword;
  var password = request.body.oldPassword;
  try {
    console.log(password);
    database.query(
      `SELECT * FROM accounts WHERE  id = ? AND password = ?`,
      [
        jwtData.id,
        crypto
          .createHash("sha256")
          .update(password + process.env.salt)
          .digest("hex"),
      ],
      function (error, results, fields) {
        if (error) console.log(error);
        if (error)
          return response.json({
            success: false,
            error: 4,
            message: "An error occured.",
          });
        if (results.length > 0) {
          database.query(
            `UPDATE accounts SET password = ? WHERE  id = ? AND password = ?`,
            [
              crypto
              .createHash("sha256")
              .update(newPassword + process.env.salt)
              .digest("hex"),
              jwtData.id,
              crypto
                .createHash("sha256")
                .update(password + process.env.salt)
                .digest("hex"),
            ],
            function (error, results, fields) {
              if (!error) return response.json({ success: true });
              if (error) console.log(error);
              if (error)
                return response.json({
                  success: false,
                  error: 4,
                  message: "An error occured.",
                });
            }
          );
        } else {
          return response.json({
            success: false,
            error: 4,
            message: "Momentanes Passwort falsch",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: "An error occured" });
  }
};
