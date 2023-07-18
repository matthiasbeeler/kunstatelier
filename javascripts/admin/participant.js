const { activationEmail } = require("../../services/mailer");
const jwt = require("jsonwebtoken");

exports.updateParticipant = function(request, response, database){
    var id = request.body.id;
    var activation = request.body.activation;
    database.query(
        "SELECT * FROM accounts WHERE id = ?",
        [id],
        function (err, results, fields) {
            if (err) console.log(err);
            if (err)
              return response.json({
                success: false,
                error: 4,
                message: "An error occured.",
              });
              if(results[0].active !== Number(activation) && activation == 1) activationEmail(results[0].email, jwt.verify(request.cookies.NyvAuth, process.env.jwtSecret).firstName,results[0].firstName);
              database.query(
                "UPDATE accounts SET firstName = ?, lastName = ?, class = ?, active = ? WHERE id = ?",
                [request.body.firstName, request.body.lastName, request.body.class, activation, id],
                function (err, results, fields) {
                    if (err) console.log(err);
                    if (err)
                      return response.json({
                        success: false,
                        error: 4,
                        message: "An error occured.",
                      });
                      if(!err) return response.json({
                        success: true});
                    })
        })
}