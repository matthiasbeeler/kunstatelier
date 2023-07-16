const jwt = require("jsonwebtoken");

exports.updateImage = function (request, response, database) {
    try {
    const sharp = require('sharp');
    var jwtData = jwt.verify(request.cookies.NyvAuth, process.env.jwtSecret);
    var image = request.files.image;
    if(image.size > 5597152) return response.json({ success: false, message: "Your images size is too big" }); 
  sharp(image.data)
   .rotate()
    .webp({ quality:50 })
    .toFile(process.cwd() + '/uploads/profileImages/' + jwtData.id+".webp", (err, info) => { console.log(err)});
  //image.mv(process.cwd() + '/public/uploads/profileImages/' + jwtData.id + fileType);
  database.query(
    "UPDATE accounts SET profilePictureUpdate = ? WHERE id = ?",
    [
      Date.now(),
        jwtData.id,
    ],
    function (err, results, fields) {
      if (!err) return response.json({ success: true });
              if (err) console.log(err);
              if (err)
                return response.json({
                  success: false,
                  error: 4,
                  message: "An error occured.",
                });
  
       
      })

        
    } catch (error) {
        console.log(error)
        return response.json({ success: false, message: "An error occured" }); 
    }
  };
  