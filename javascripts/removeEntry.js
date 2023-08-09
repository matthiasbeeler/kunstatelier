const jwt = require("jsonwebtoken");
const { newEntry, removeEntry } = require("../services/mailer");

exports.removeEntry = function (request, response, database) {
  try {
  var jwtData = jwt.verify(request.cookies.NyvAuth, process.env.jwtSecret);
  database.query(
    `SELECT *,Date_Format(date, '%d.%m.%Y') as dateNew FROM ateliers where CURDATE() <= date AND id = ?;`,[request.body.atelierId],function (error, results, fields) {
      if (error) console.log(err);
      if (error) return response.json({ success: false, error: 4 });
      if(results[0]){
        if(results.length > 0){
            if(!results[0].participantsList){return response.json({success: false, erro: 1, message: "Atelier nicht verfügbar"});}else{results[0].participantsList = JSON.parse(results[0].participantsList)}
            if(!results[0].participantsList.includes(jwtData.id))return response.json({success: false, erro: 1, message: "Nicht eingetragen"});
            const index = results[0].participantsList.indexOf(jwtData.id);
            if (index > -1) { // only splice array when item is found
                results[0].participantsList.splice(index, 1); // 2nd parameter means remove one item only
            }
            results[0].participants = Number(results[0].participants)-1;
            if(results[0].participants < 0) results[0].participants  = 0;
            var atelier = results[0];
            console.log(atelier)
            database.query(
              `UPDATE ateliers SET participants=?, participantsList=? WHERE id = ?;`,[results[0].participants, JSON.stringify(results[0].participantsList),request.body.atelierId],function (error, result, fields) {
                if (error) console.log(err);
                if (error) return response.json({ success: false, error: 4 });
                removeEntry(jwtData.email, jwtData.firstName, atelier);
                if (!error) return response.json({success: true, participants: results[0].participants});
              })
            }else{
              return response.json({success: false, erro: 1, message: "Maximale Teilnehmeranzahl bereits erreicht"});
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
