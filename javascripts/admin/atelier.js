const { activationEmail } = require("../../services/mailer");
const jwt = require("jsonwebtoken");

exports.updateAtelier = function(request, response, database){
    var id = request.body.id;
    database.query(
        "SELECT * FROM ateliers WHERE id = ?",
        [id],
        function (err, results, fields) {
            if (err) console.log(err);
            if (err)
              return response.json({
                success: false,
                error: 4,
                message: "An error occured.",
              });
              if(request.body.participantCapacity == "") request.body.participantCapacity = null;
              database.query(
                "UPDATE ateliers SET date = ?, time = ?, subject = ?, furtherInformation = ?, participantCapacity=? WHERE id = ?",
                [request.body.date.split(".")[2]+"-"+request.body.date.split(".")[1]+"-"+request.body.date.split(".")[0], request.body.time, request.body.subject, request.body.furtherInformation, request.body.participantCapacity, id],
                function (err, results, fields) {
                    console.log(request.body)
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