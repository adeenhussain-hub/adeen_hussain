const express = require("express");
const { body, header, param } = require("express-validator");
const storyController = require("../controllers/storyController");
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require("../middlewares/validate");
const { handleSingleUpload } = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, handleSingleUpload("media"), storyController.createStory)
router.post('/delete/:id', authMiddleware, storyController.deleteStory)
router.get('/show', authMiddleware, storyController.showAllStories)
router.get('/showArchive', authMiddleware, storyController.showAllArchiveStories)


module.exports = router;
