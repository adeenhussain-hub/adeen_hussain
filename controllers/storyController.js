const storyModel = require("../models/storyModel");
const { validationResult } = require("express-validator");

const model = new storyModel();

class storyController {
    async createStory(req, res) {
        try {
            const userId = req.user.id;
            const mediaPath = req.file ? `/uploads/${req.file.filename}` : null;
            if (!mediaPath) {
                return res.status(400).json({ message: "Media is required", });
            }
            await model.addToStory(userId, mediaPath);
            return res.status(201).json({ message: "Story created successfully" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async deleteStory(req, res) {

        try {
            const Id = req.params.id;
            if (!Id) {
                return res.status(400).json({ message: "Story Id is required", });
            }
            const story = await model.getStoryById(Id);
            if (!story) return res.status(404).json({ message: "Story Not Found" });
            console.log(story);

            if (story.user_id !== req.user.id) return res.status(400).json({ message: "Unauthorized" });

            await model.deleteStory(Id, req.user.id);

            return res.status(200).json({ message: "Story Deleted successfully" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async showAllStories(req, res) {
        try {
            const userId = req.user.id;
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const results = await model.getStories(userId, limit, offset)
            if (results.length === 0) return res.status(404).json({ message: "No Stories Found" })

            return res.status(200).json({ message: "Stories Loaded Successsfully", count: results.length, results: results })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });

        }


    }
    async showAllArchiveStories(req, res) {
        try {
            const userId = req.user.id;
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const results = await model.getAllArchiveStories(userId, limit, offset)
            if (results.length === 0) return res.status(404).json({ message: "No Stories Found" })

            return res.status(200).json({ message: "Stories Loaded Successsfully", count: results.length, results: results })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });

        }


    }
}

module.exports = new storyController();