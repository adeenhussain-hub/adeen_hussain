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
            if (!findUser) return res.status(400).json({ message: "user not found" });
            const verifyPass = await bcrypt.compare(password, findUser.password)
            if (!verifyPass) {
                return res.status(400).json({ message: "invalid password" });
            }
            const id = findUser.id;
            const accessToken = generateAccessToken({ id, email })
            const refreshToken = generateRefreshToken({ id, email })

            await AuthModel.updateToken(refreshToken, email);

            return res.status(200).json({ message: "Login Successfully", accessToken: accessToken, refreshToken: refreshToken });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });

        }
    }

    async refresh(req, res) {
        try {
            const refreshToken = req.body.refreshToken;   // or cookie

            if (!refreshToken) {
                return res.status(400).json({ message: "Refresh token required" });
            }

            // 1. Verify refresh token signature
            let decoded;
            try {
                decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
            } catch (err) {
                return res.status(401).json({ message: "Refresh token invalid or expired" });
            }

            // 2. Check refresh token in DB (to ensure it's not revoked)
            const stored = await AuthModel.getRefresh(decoded.email);

            if (!stored || stored.refresh_token !== refreshToken) {
                return res.status(401).json({ message: "Refresh token not found or revoked" });
            }

            // 3. Generate new access token
            const newAccessToken = generateAccessToken({
                id: decoded.id,
                email: decoded.email
            });

            // 4. OPTIONAL but recommended: rotate refresh token
            const newRefreshToken = generateRefreshToken({
                id: decoded.id,
                email: decoded.email
            });

            // 5. Save new refresh token to DB (overwrite old)
            await AuthModel.updateToken(newRefreshToken, decoded.email);

            return res.json({
                message: "New tokens issued",
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

}

module.exports = new authController();