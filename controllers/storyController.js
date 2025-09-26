const storyModel = require("../models/storyModel");
const { validationResult } = require("express-validator");

const model = new storyModel();

class storyController {
    async createVideo(req, res) {
        try {
            const createdBy = req.user.id;
            // console.log(createdBy);

            const { title, description } = req.body
            const videoPath = req.file ? `/uploads/${req.file.filename}` : null
            if (!videoPath) return res.status(400).json({ message: "Video Required" })

            await model.addVideo({ title, description, videoPath: videoPath, createdBy });

            return res.status(200).json({ message: "Video Posted Successfully" })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
}

module.exports = new storyController();