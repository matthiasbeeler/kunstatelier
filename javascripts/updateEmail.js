const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.updateEmail = function (request, response, database) {
    var jwtData = jwt.verify(request.cookies.NyvAuth, process.env.jwtSecret);
    var email = request.body.email;
    var password = request.body.password;
    try {
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
                if(results.length > 0){
                    database.query(
                        `UPDATE accounts SET email = ? WHERE  id = ? AND password = ?`,
                        [
                            email,
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
                })
                }else{
                    return response.json({
                        success: false,
                        error: 4,
                        message: "Passwort falsch",
                      });
                }
     
                
       
      })

        
    } catch (error) {
        console.log(error)
        return response.json({ success: false, message: "An error occured" }); 
    }
  };
  