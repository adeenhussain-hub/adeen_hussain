const jwt = require("jsonwebtoken");

async function verifyUserToken(req) {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) return resolve(null); 

    jwt.verify(token, "power", (err, decoded) => {
      if (err) return resolve(null); 
      resolve(decoded); 
    });
  });
}

module.exports = verifyUserToken;
