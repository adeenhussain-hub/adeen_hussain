const sql = require('mysql');
const db = require("../config/db");
const { promises } = require('nodemailer/lib/xoauth2');

class discoverModel {
    async showFeed(userId, limit, offset) {
        return new Promise((resolve, reject) => {
            db.query(`Select v.id, v.title, v.description, v.likesCount, v.url, v.createdAt,u.id AS uploaderId, u.username AS uploaderName from videos v join users u ON u.id = v.createdBy join follows f ON f.followingId = u.id where f.followerId = ? AND u.id NOT IN (SELECT blockerId FROM blocks WHERE blockedId = ?) AND u.id NOT IN (SELECT blockedId FROM blocks WHERE blockerId = ?) ORDER BY v.createdAt DESC LIMIT ? OFFSET ?;`, [userId, userId, userId, limit, offset], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async showTrendingFeed(userId, limit, offset) {
        return new Promise((resolve, reject) => {
            db.query(`Select v.id as VideoId, u.username, v.title, v.url, v.description, v.createdBy, v.likesCount from videos v join users u ON v.createdBy = u.id JOIN video_likes vl ON v.id = vl.videoId  and vl.createdAt >= NOW() - INTERVAL 7 DAY where u.id NOT IN (SELECT blockerId FROM blocks WHERE blockedId = ?) AND u.id NOT IN (SELECT blockedId FROM blocks WHERE blockerId = ?)  order by v.likesCount DESC LIMIT ? OFFSET ?`, [userId, userId, limit, offset], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async showMutualFollowers(userId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT u.id, u.username from users u join follows f on u.id = f.followingId where f.followerId = ? and u.id NOT IN (SELECT blockerId FROM blocks WHERE blockedId = ?) AND u.id NOT IN (SELECT blockedId FROM blocks WHERE blockerId = ?)`, [userId, userId, userId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async showTrendingUsers(userId,limit) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT u.id, u.username, COUNT(vl.id) AS recentLikes FROM users u JOIN videos v ON u.id = v.createdBy JOIN video_likes vl ON v.id = vl.videoId WHERE vl.createdAt >=NOW() - INTERVAL 7 DAY and u.id NOT IN (SELECT blockerId FROM blocks WHERE blockedId = ?) AND u.id NOT IN (SELECT blockedId FROM blocks WHERE blockerId = ?) GROUP BY u.id, u.username ORDER BY recentLikes DESC LIMIT ? `,[userId,userId,limit], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    async findUserByID(userId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users where id=?`, [userId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }
}
module.exports = discoverModel;