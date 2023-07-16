const jwt = require("jsonwebtoken");

exports.checkActivationStatus = function (request, response, database) {
  var jwtData = jwt.verify(request.cookies.NyvAuth, process.env.jwtSecret);
  if(jwtData.active) return response.json({success: true});
  database.query(
    `SELECT * FROM accounts WHERE id = ?`,[jwtData.id],function (error, results, fields) {
        if(results[0].active){
            jwtData.active = results[0].active;
            var token = jwt.sign(
                  jwtData,
                process.env.jwtSecret
              );
              response.cookie("NyvAuth", token, {
                maxAge: 9999 * 60 * 60 * 1000,
                httpOnly: false,
                overwrite: true,
              });
              return response.json({success: true});
        }else{
            return response.json({success: false, erro: 1, message: "Noch nicht freigeschaltet."});
        }
    })
};
