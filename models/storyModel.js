const sql = require('mysql');
const db = require("../config/db");
const { promises } = require('nodemailer/lib/xoauth2');

class StoryModel {
    async addToStory(userId, media) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO story (user_id, media) VALUES (?, ?)`;
            db.query(query, [userId, media], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async deleteStory(id, userId) {
        return new Promise((resolve, reject) => {
            db.query('Delete from story where id=? and user_id = ?', [id, userId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async getStoryById(id) {
        return new Promise((resolve, reject) => {
            // console.log(id)
            db.query('Select * from story where id=?', [id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }
    async getStories(userId, limit, offset) {
        return new Promise((resolve, reject) => {
            // console.log(id)
            db.query('SELECT s.*, u.username FROM story s JOIN users u ON u.id = s.user_id WHERE s.expires_at > NOW() AND u.id NOT IN (SELECT blockerId FROM blocks WHERE blockedId = ?) AND u.id NOT IN (SELECT blockedId FROM blocks WHERE blockerId = ?) GROUP BY u.id, u.username ORDER BY s.created_at DESC LIMIT ? OFFSET ?', [userId, userId, limit, offset], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async getAllArchiveStories(userId,limit, offset) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM story where user_id = ? limit ? offset ?', [userId, limit, offset], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}
module.exports = StoryModel;