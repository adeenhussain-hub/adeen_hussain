const sql = require('mysql');
const db = require("../config/db");
const { promises } = require('nodemailer/lib/xoauth2');

class msgModel {
    async getChatHistoryById(senderId, receiverId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY send_at ASC`;
            db.query(query, [senderId, receiverId, receiverId, senderId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async isblocked(senderId, receiverId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM blocks WHERE (blockerId=? AND blockedId=?) OR (blockerId=? AND blockedId=?)`;
        db.query(query, [senderId, receiverId, receiverId, senderId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
        async insertInDB(senderId, receiverId,message) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`;
        db.query(query, [senderId, receiverId, message], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}
module.exports = msgModel;