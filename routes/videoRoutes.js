const express = require("express");
const { body, header, param } = require("express-validator");
const videoController = require("../controllers/videoController");
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadVideoMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, upload.single("videoPath"), [
    body("title").notEmpty().withMessage("Title is required").isLength({ max: 255 }).withMessage("Title must be less than 255 characters"),
    body("description").optional().isLength({ max: 1000 }).withMessage("Description must be less than 1000 characters"),
], videoController.createVideo)

router.get('/search',authMiddleware, videoController.searchVideos)
router.delete("/delete/:id", authMiddleware, videoController.deleteVideo);
router.post('/:id/like', authMiddleware, videoController.likeVideo)
router.post('/:id/unlike', authMiddleware, videoController.unlikeVideo)

router.get("/by/:id", videoController.getVideoById);
router.get('/:id/videos', videoController.getVideosByUploaderId)
router.get('/:id/liked-videos', videoController.videosLikedById)

module.exports = router;
