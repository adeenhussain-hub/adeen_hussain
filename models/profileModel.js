    const sql = require('mysql');
    const db = require("../config/db");
    const { promises } = require('nodemailer/lib/xoauth2');

    class profileModel {
        async followUserById(followerId, FollowingId) {
            return new Promise((resolve, reject) => {
                db.query('INSERT INTO follows (followerId,followingId) VALUES(?, ?)', [followerId, FollowingId], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }
        async updateTotalFollowing(sign, followerId) {
            if (sign !== "+" && sign !== "-") {
                throw new Error("Invalid sign, must be '+' or '-'");
            }
            return new Promise((resolve, reject) => {
                db.query(`UPDATE users SET followingCount = followingCount ${sign} 1 WHERE id = ?`, [followerId], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }

        async updateTotalFollowers(sign, FollowingId) {
            if (sign !== "+" && sign !== "-") {
                throw new Error("Invalid sign, must be '+' or '-'");
            }
            return new Promise((resolve, reject) => {
                db.query(`UPDATE users SET followersCount =followersCount ${sign} 1 WHERE id = ?`, [FollowingId], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }

        async unFollow(followerId, FollowingId) {
            return new Promise((resolve, reject) => {
                db.query('DELETE FROM follows where followerId = ? AND followingId = ?', [followerId, FollowingId], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }

        async getfollowingsById(id) {
            return new Promise((resolve, reject) => {
                db.query('SELECT DISTINCT u.id,u.username as Username FROM users join follows f join users u ON u.id = f.followingId where f.followerId = ?;', [id], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }
        async getFollowersById(id) {
            return new Promise((resolve, reject) => {
                db.query('SELECT DISTINCT u.id,u.username as Username FROM users join follows f join users u ON u.id = f.followerId where f.followingId = ?;', [id], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }
        async getStats(id) {
            return new Promise((resolve, reject) => {
                db.query('SELECT u.id AS userId,u.username,u.followersCount,u.followingCount, COUNT(DISTINCT v.id) AS videosCount,(SELECT COUNT(*) FROM videos v2 WHERE v2.createdBy = u.id AND v2.likesCount > 0) AS likedVideosCount FROM users u LEFT JOIN videos v ON v.createdBy = u.id where u.id = ?;', [id], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }
        async block(blockerId, blockedId) {
            return new Promise((resolve, reject) => {
                db.query('INSERT INTO blocks (blockerId,blockedId) VALUES(?, ?)', [blockerId, blockedId], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }
        async unBlock(blockerId, blockedId) {
            return new Promise((resolve, reject) => {
                db.query('DELETE FROM blocks where blockerId = ? AND blockedId = ?', [blockerId, blockedId], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }
        async isBlocked(blockdBy, userID) {
            return new Promise((resolve, reject) => {
                db.query('Select * from blocks where blockerId = ? AND blockedId = ?', [blockdBy,userID], (err, result) => {
                    if (err) return reject(err);
                    resolve(result[0]);
                });
            });
        }


    }
    module.exports = profileModel;