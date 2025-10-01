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
    async addComment(videoId, userId, content, parentId) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO comments (videoId, userId, content,parentCommentId) VALUES (?, ?, ?, ?)`;
            db.query(query, [videoId, userId, content, parentId], (err, result) => {
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
    async getAllCommentsOnVideo(videoId, userId, limit, offset) {
        return new Promise((resolve, reject) => {
            const query = `SELECT c.id, c.content,c.likesCount, c.createdAt, u.id AS userId, u.username FROM comments c JOIN users u ON c.userId = u.id WHERE c.videoId = ? AND c.parentCommentId IS NULL AND u.id NOT IN (SELECT blockedId FROM blocks WHERE blockerId = ?) AND u.id NOT IN (SELECT blockerId FROM blocks WHERE blockedId = ?) ORDER BY c.createdAt DESC LIMIT ? OFFSET ?`;
            db.query(query, [videoId, userId, userId, limit, offset], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    async isCommentLiked(commentId, userID) {
        return new Promise((resolve, reject) => {
            db.query('Select * from commentlikes where commentId = ? AND userId = ?', [commentId, userID], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }
    async likeComment(commentId, userId) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO commentlikes (commentId,userId) VALUES(?,?)', [commentId, userId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
    async updateCommentsLikesCount(sign, commentId) {

        if (sign !== "+" && sign !== "-") {
            throw new Error("Invalid sign, must be '+' or '-'");
        }
        return new Promise((resolve, reject) => {
            db.query(`Update comments Set likesCount = likesCount ${sign} 1 where id=?`, commentId, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
    async unlikeComment(commentId, userId) {
        return new Promise((resolve, reject) => {
            db.query('Delete from commentlikes where commentId = ? and userId =?', [commentId, userId], (err, result) => {
                if (err) return reject(err);
                resolve(result);

            })
        })
    }
    async isVideoLiked(videoId, userId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM video_likes WHERE videoId = ? AND userId = ?', [videoId, userId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }
    async editComment(content, commentID) {
        return new Promise((resolve, reject) => {
            const query = `Update comments SET content = ? where id=?`;
            db.query(query, [content, commentID], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async getAllRepliesOnCommentsById(commentID, userId, limit, offset) {
        return new Promise((resolve, reject) => {
            const query = `SELECT c.id, u.username , c.userId, c.content,c.likesCount, c.createdAt FROM comments c JOIN users u ON u.id = c.userId WHERE c.parentCommentId = ? AND u.id NOT IN (SELECT blockedId FROM blocks WHERE blockerId = ?) AND u.id NOT IN (SELECT blockerId FROM blocks WHERE blockedId = ?)  ORDER BY c.createdAt ASC;`;
            db.query(query, [commentID, userId, userId, limit, offset], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    async addView(userId, videoId) {
        return new Promise((resolve, reject) => {
            db.query('Insert INTO video_views (user_id,video_id) values(?,?)', [userId, videoId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    async increamentViewCount(videoId) {
        return new Promise((resolve, reject) => {
            db.query('update videos set viewsCount = viewsCount + 1 where id =?', [videoId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    async getViewRecordById(userId,videoId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT viewed_at FROM video_views WHERE user_id = ? AND video_id = ? ORDER BY viewed_at DESC LIMIT 1', [userId,videoId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
}
module.exports = videoModel;