const sql = require('mysql');
const db = require("../config/db");
const { promises } = require('nodemailer/lib/xoauth2');

class videoModel {
    async addVideo(video) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO videos (title, description, url, createdBy) VALUES (?, ?, ?, ?)`;
            db.query(query, [video.title, video.description, video.videoPath, video.createdBy], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async getAllVideos() {
        return new Promise((resolve, reject) => {
            const query = `SELECT id, title, description, url, createdBy, createdAt FROM videos ORDER BY createdAt DESC`;
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    async getVideoById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT id, title, description, url, createdBy, createdAt FROM videos WHERE id = ?`;
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
    async deleteVideo(id) {
        return new Promise((resolve, reject) => {
            const query = `Delete From videos where id=?`;
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
    async likeVideoById(userId, videoId) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO video_likes (userId,videoId) VALUES(?,?)', [userId, videoId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
    async updateLikesCount(sign, videoId) {
        if (sign !== "+" && sign !== "-") {
            throw new Error("Invalid sign, must be '+' or '-'");
        }
        return new Promise((resolve, reject) => {
            db.query(`UPDATE videos Set likesCount = likesCount ${sign} 1 where id=?`, [videoId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
    async unlikeVideoById(userId, videoId) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM video_likes where userId = ? AND videoId = ?', [userId, videoId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
    async searchVideos(userId, query, limit, offset) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT v.id, v.title, v.description, v.url, v.likesCount, v.createdAt,u.id AS uploaderId, u.username AS uploaderName FROM videos v JOIN users u ON v.createdBy = u.id WHERE v.title LIKE ? OR u.username LIKE ? AND u.id NOT IN (SELECT blockerId FROM blocks WHERE blockedId = ?) AND u.id NOT IN (SELECT blockedId FROM blocks WHERE blockerId = ?) ORDER BY v.createdAt DESC LIMIT ? OFFSET ?;`;
            const searchQuery = `%${query}%`;
            db.query(sql, [searchQuery, searchQuery, userId, userId, limit, offset], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async videosUploaderById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT u.username as Uploader, v.title,v.description,v.url,v.createdBy from videos v Join users u on u.id = ? ', [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async videosLikedById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT v.id, v.title, v.description, v.url, v.likesCount, v.createdAt,u.id AS uploaderId, u.username AS uploaderName FROM video_likes l JOIN videos v ON l.videoId = v.id JOIN users u ON v.createdBy = u.id WHERE l.userId = ?', [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async isBlocked(blockdBy, userID) {
        return new Promise((resolve, reject) => {
            db.query('Select * from blocks where blockerId = ? AND blockedId = ?', [blockdBy, userID], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }
    async addComment(videoId, userId, content) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO comments (videoId, userId, content) VALUES (?, ?, ?)`;
            db.query(query, [videoId, userId, content], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async updateCommentsCount(sign, videoId, createdBy) {
        if (sign !== "+" && sign !== "-") {
            throw new Error("Invalid sign, must be '+' or '-'");
        }
        return new Promise((resolve, reject) => {
            db.query(`UPDATE videos Set commentsCount = commentsCount ${sign} 1 where id=?`, [videoId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    async deleteComment(commentId) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM comments WHERE id = ?`;
            db.query(query, [commentId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async getCommentById(commentId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT id, videoId, userId, content, createdAt FROM comments WHERE id = ?`;
            db.query(query, [commentId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }


}
module.exports = videoModel;