const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require('../utils/token')
const authModel = require("../models/authModel");
const { validationResult } = require("express-validator");

const AuthModel = new authModel();

class authController {

    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { username, email, password } = req.body;
            const pass_hash = await bcrypt.hash(password, 10);

            await AuthModel.addUser({ username, email, pass_hash })
            res.status(201).json({ message: "User Registered" })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body
            const findUser = await AuthModel.findByEmail(email);
            if (!findUser) {
                return res.status(400).json({ message: "user not found" });
            }
            const verifyPass = await bcrypt.compare(password, findUser.password)
            if (!verifyPass) {
                return res.status(400).json({ message: "invalid password" });
            }
            const id = findUser.id;
            const accessToken = generateAccessToken({ id, email })
            const refreshToken = generateRefreshToken({ id, email })

            await AuthModel.insertToken(refreshToken, email);

            return res.status(200).json({ message: "Login Successfully", accessToken: accessToken, refreshToken: refreshToken });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });

        }
    }

    async refresh(req, res) {
        try {
            const token = req.headers["authorization"];
            if (!token) {
                return res.status(400).json({ message: "Refresh token required" });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const id = decoded.id;
            const accessToken = generateAccessToken({id:decoded.id,email :decoded.email})
            // console.log(decoded.email);
            return res.json({ message: "Access Token Generated",Access_Token: accessToken})
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token Expired" })
            } else {
                return res.status(500).json({ message: "Server Error", error: err })
            }
        }
    }
}

module.exports = new authController();