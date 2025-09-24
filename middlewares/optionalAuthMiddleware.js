const jwt = require("jsonwebtoken");
// const check = require('./RoleMiddleware')
// const UserModel = require("../models/userModel");
require('dotenv').config();


async function optionalAuthMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return next();

  // const token; // removes "Bearer"
  // if (!token) {
  //   return res.status(403).json({ message: "Token missing" });
  // }

  // let s = jwt.decode(token);
  // // console.log(s);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userModel = new UserModel();

    // const user = await userModel.findByEmail(decoded.email);
    // console.log(user,"this is user");

    // if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = { id: decoded.id, email: decoded.email };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" })
    } else {
      return res.status(401).json({ message: "Invalid token" })
    }
  }
}

module.exports = optionalAuthMiddleware;
