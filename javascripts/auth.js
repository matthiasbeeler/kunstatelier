const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
var validator = require("validator");
var special_chars = [
  "FROM",
  "DROP",
  "drop",
  "SELECT",
  "<",
  ">",
  "=",
  ";",
  "&",
  "'",
  "/",
];

exports.login = function (request, response, database, bouncer) {
  if (!request.body.input || !request.body.password)
    return response.json({ success: false, error: 1 });
  var input = request.body.input.trim().replace(/\s{2,}/g, " ");
  var password = request.body.password;
  var inputType = "email";
  if (validator.isEmpty(input) || validator.isEmpty(password))
    return response.json({
      success: false,
      error: 1,
      message: "Bitte alle Felder ausfüllen",
    });
  if (validator.isEmail(input)) inputType = "email";
  database.query(
    `SELECT * FROM accounts WHERE  ${inputType} = ? AND password = ?`,
    [
      input,
      crypto
        .createHash("sha256")
        .update(password + process.env.salt)
        .digest("hex"),
    ],
    function (error, results, fields) {
      var userData = results;
      if (error) console.log(err);
      if (error)
        return response.json({
          success: false,
          error: 2,
          message: "Ein Fehler ist aufgetreten.",
        });
      if (userData.length > 0) {
        if (!userData[0].active)
          return response.json({
            success: false,
            error: 4,
            message: "Dein Account ist nicht aktiv.",
          });
        var admin = userData[0].admin;
        var token = jwt.sign(
          {
            email: userData[0].email,
            id: userData[0].id,
            loggedin: true,
            active: userData[0].active,
            firstName: userData[0].firstName,
            lastName: userData[0].lastName,
            class: userData[0].class,
            admin: admin,
            registrationTimestamp: userData[0].registrationTimestamp
          },
          process.env.jwtSecret
        );
        bouncer.reset(request);
        response.cookie("NyvAuth", token, {
          maxAge: 9999 * 60 * 60 * 1000,
          httpOnly: false,
          overwrite: true,
        });
        return response.json({ success: true });
      } else {
        return response.json({
          success: false,
          error: 3,
          message: "Es wurde kein Account mit diesen Eingaben gefunden.",
        });
      }
    }
  );
};

exports.signup = function (request, response, database) {
  try {
    //Firstname, email and password
    if (
      !request.body.class ||
      !request.body.lastName ||
      !request.body.firstName ||
      !request.body.email ||
      !request.body.password
    )
      return response.json({ success: false, error: 1 });
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var grade = request.body.class;
    var password = request.body.password;
    var email = request.body.email;
    console.log(request.body);
    if (
      validator.isEmpty(firstName) ||
      validator.isEmpty(email) ||
      validator.isEmpty(lastName) ||
      validator.isEmpty(grade) ||
      validator.isEmpty(password)
    )
      return response.json({ success: false, error: 1 });
    if (!validator.isEmail(email))
      return response.json({ success: false, error: 1 });
    database.query(
      `SELECT * FROM accounts WHERE email = ?;`,
      [email],
      function (error, results, fields) {
        if (!results.length <= 0)
          return response.json({ success: false, error: 2 });
        var uuid = uuidv4();

        database.query(
          `INSERT INTO accounts (id, firstName,lastName, email, class, password, active, registrationTimestamp) VALUES (?,?,?,?,?,?,?,?);`,
          [
            uuid,
            firstName,
            lastName,
            email,
            grade,
            crypto
              .createHash("sha256")
              .update(password + process.env.salt)
              .digest("hex"),
            ,
            false,
            Date.now(),
          ],
          function (error, results, fields) {
            if (error) console.log(error);
            if (error) return response.json({ success: false, error: 3 });
            var token = jwt.sign(
              {
                id: uuid,
                loggedin: true,
                active: false,
                firstName: firstName,
                lastName: lastName,
                class: grade,
                admin: false,
                email: email,
                registrationTimestamp: Date.now()
              },
              process.env.jwtSecret
            );
            response.cookie("NyvAuth", token, {
              maxAge: 9999 * 60 * 60 * 1000,
              httpOnly: false,
              overwrite: true,
            });
            response.json({ success: true });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
  }
};
