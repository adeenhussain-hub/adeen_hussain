const sql = require('mysql');
const db = require("../config/db");
const { promises } = require('nodemailer/lib/xoauth2');

class auth {
    async addUser(users) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users (username, email, password) VALUES(?, ?, ?)', [users.username, users.email, users.pass_hash], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }
    async updateToken(token,email) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE users SET refresh_token = ? WHERE email = ?', [token,email], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async getRefresh(email) {
        return new Promise((resolve, reject) => {
            db.query('Select refresh_token from users WHERE email = ?', [email], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }

}
module.exports = auth;