const { activationEmail, atelierEdit } = require("../../services/mailer");
const jwt = require("jsonwebtoken");

exports.updateAtelier = function(request, response, database){
    var id = request.body.id;
    console.log(request.body)
    database.query(
        "SELECT *,Date_Format(date, '%d.%m.%Y') as dateNew FROM ateliers where CURDATE() <= date AND id = ?;",
        [id],
        function (err, results, fields) {
            if (err) console.log(err);
            if (err)
              return response.json({
                success: false,
                error: 4,
                message: "An error occured.",
              });
              if(results[0]){
                if(results.length > 0){
              if(request.body.participantCapacity == "") request.body.participantCapacity = null;
              database.query(
                "UPDATE ateliers SET date = ?, time = ?, subject = ?, furtherInformation = ?, participantCapacity=?,guidance=? WHERE id = ?",
                [request.body.date.split(".")[2]+"-"+request.body.date.split(".")[1]+"-"+request.body.date.split(".")[0], request.body.time, request.body.subject, request.body.furtherInformation, request.body.participantCapacity,request.body.activeSelect, id],
                function (err, results, fields) {
                    if (err) console.log(err);
                    if (err)
                      return response.json({
                        success: false,
                        error: 4,
                        message: "An error occured.",
                      });
                      database.query(
                        "SELECT *,Date_Format(date, '%d.%m.%Y') as dateNew FROM ateliers WHERE id = ?",
                        [id],
                        function (err, results, fields) {
                          var atelier = results[0];
                          if(!results[0].participantsList){results[0].participantsList = [];}else{results[0].participantsList = JSON.parse(results[0].participantsList)}
                          database.query(
                            `SELECT id, firstName, email FROM accounts WHERE id in ('${atelier.participantsList.join("','")}');`,
                            function (error, results, fields) {
                              if (error) console.log(err);
                              if (error) return res.redirect('/user')
                              var accountsData = results;
                              atelierEdit(accountsData, atelier)
                      if(!err) return response.json({
                        success: true});
                    })
                  })
                  

                  })
                }else{
                  return response.json({success: false, erro: 1, message: "Atelier nicht verfügbar"});
              }
            }else{
                return response.json({success: false, erro: 1, message: "Atelier nicht verfügbar"});
            }

        })
}