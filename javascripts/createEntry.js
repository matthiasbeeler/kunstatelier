const jwt = require("jsonwebtoken");
const { newEntry } = require("../services/mailer");

exports.createEntry = function (request, response, database) {
  try {
  var jwtData = jwt.verify(request.cookies.NyvAuth, process.env.jwtSecret);
  database.query(
    `SELECT *,Date_Format(date, '%d.%m.%Y') as dateNew FROM ateliers where CURDATE() <= date AND id = ?;`,[request.body.atelierId],function (error, results, fields) {
      if (error) console.log(err);
      if (error) return response.json({ success: false, error: 4 });
      if(results[0]){
        if(results.length > 0){
          if(results[0].participantCapacity == null | results[0].participantCapacity > results[0].participants){
            if(!results[0].participantsList){results[0].participantsList = [];}else{results[0].participantsList = JSON.parse(results[0].participantsList)}
            if(results[0].participantsList.includes(jwtData.id))return response.json({success: false, erro: 1, message: "Bereits eingetragen"});
            results[0].participantsList.push(jwtData.id)
            results[0].participants = Number(results[0].participants)+1;
            var atelier = results[0];
            database.query(
              `UPDATE ateliers SET participants=?, participantsList=? WHERE id = ?;`,[results[0].participants, JSON.stringify(results[0].participantsList),request.body.atelierId],function (error, result, fields) {
                if (error) console.log(err);
                if (error) return response.json({ success: false, error: 4 });
                newEntry(jwtData.email, jwtData.firstName, atelier);
                if (!error) return response.json({success: true, participants: results[0].participants});
              })
            }else{
              return response.json({success: false, erro: 1, message: "Maximale Teilnehmeranzahl bereits erreicht"});
          }
        }else{
            return response.json({success: false, erro: 1, message: "Atelier nicht verfügbar"});
        }
      }else{
        return response.json({success: false, erro: 1, message: "Atelier nicht verfügbar"});
    }
    })

    
  } catch (error) {
    console.log(error)
    return response.json({success: false, erro: 1, message: "Momentan nicht verfügbar"});

  }
};
