const token = require("jsonwebtoken");
require('dotenv').config();

function generateAccessToken(payload) {
    let jwt = token.sign(payload, process.env.ACCESS_SECRET, { expiresIn: "15m" })
    return jwt
}
function generateRefreshToken(payload) {
    let jwt = token.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" })
    return jwt
}
module.exports = { generateAccessToken,generateRefreshToken }