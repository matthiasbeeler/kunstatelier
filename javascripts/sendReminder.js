const { newEntry, removeEntry, reminder } = require("../services/mailer");

exports.sendReminder = function (database) {
  try {
  database.query(
    `SELECT *,Date_Format(date, '%d.%m.%Y') as dateNew FROM ateliers where CURDATE() = date;`,function (error, results, fields) {
      if (error) console.log(err);
      if(results[0]){
        if(results.length > 0){
            var ateliers = results;
             for(var i = 0; i < ateliers.length; i++) { 
                var atelierData = ateliers[i];
                if(!ateliers[i].participantsList){}else{ateliers[i].participantsList = JSON.parse(ateliers[i].participantsList)}
                database.query(
                    `SELECT id, firstName, email FROM accounts WHERE id in ('${atelierData.participantsList.join("','")}');`,
                    function (error, results, fields) {
                      if (error) console.log(err);
                      if (error) return res.redirect('/user')
                      var accountsData = results;
                    reminder(accountsData, atelierData);
                    })
               }
            }else{
          }
        }else{
        }
     
    })

    
  } catch (error) {
    console.log(error)

  }
};
