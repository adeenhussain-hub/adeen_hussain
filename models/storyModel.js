const sql = require('mysql');
const db = require("../config/db");
const { promises } = require('nodemailer/lib/xoauth2');

class StoryModel {
    async addVideo(video) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO videos (title, description, url, createdBy) VALUES (?, ?, ?, ?)`;
            db.query(query, [video.title, video.description, video.videoPath, video.createdBy], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}   
module.exports = StoryModel;