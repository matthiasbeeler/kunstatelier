const jwt = require("jsonwebtoken");

exports.createAtelier = function (request, response, database) {
    try {

    console.log(request.body)
    var jwtData = jwt.verify(request.cookies.NyvAuth, process.env.jwtSecret);
    console.log(typeof request.body.participantCapacity)
    if(request.body.participantCapacity == "") request.body.participantCapacity = null;
    database.query(
    "INSERT INTO ateliers (date, time, furtherInformation, subject, createdAt, creator, participantCapacity) VALUES(?,?,?,?,?,?,?)",
    [
      request.body.date.split(".")[2]+"-"+request.body.date.split(".")[1]+"-"+request.body.date.split(".")[0],
      request.body.time,
      request.body.furtherInformation,
      request.body.subject,
      Date.now(),
      jwtData.id,
      request.body.participantCapacity,
    ],
    function (err, results, fields) {
      if (err) console.log(err);
      if (err)
        return response.json({
          success: false,
          error: 4,
          message: "An error occured.",
        });

      if (!err)
        return response.json({
          success: true,
        });
    }
  );
          
} catch (error) {
        console.log(error)
        return response.json({
            success: false,
            error: 4,
            message: "An error occured.",
          });
}
};
