const express = require("express");
const { body, header, param } = require("express-validator");
const videoController = require("../controllers/videoController");
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require("../middlewares/validate");
const upload = require('../middlewares/uploadVideoMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, upload.single("videoPath"), [
    body("title").notEmpty().withMessage("Title is required").isLength({ max: 255 }).withMessage("Title must be less than 255 characters"),
    body("description").optional().isLength({ max: 1000 }).withMessage("Description must be less than 1000 characters"),
], validate, videoController.createVideo)

router.get('/search', authMiddleware, videoController.searchVideos)

router.delete("/delete/:id", authMiddleware, videoController.deleteVideo);

router.post('/:id/like', authMiddleware, videoController.likeVideo)

router.post('/:id/togglelikeVideo', authMiddleware, videoController.toggleVideoLike)
      
router.post('/:id/unlike', authMiddleware, videoController.unlikeVideo)

router.get("/by/:id", videoController.getVideoById);

router.get('/:id/videos', videoController.getVideosByUploaderId)

router.get('/:id/liked-videos', videoController.videosLikedById)

router.get("/:id/showcomments", authMiddleware, videoController.getAllComments);

router.post('/:id/addcomments', authMiddleware, [
    body("content").notEmpty().withMessage("Comment is required").isLength({ max: 500 }).withMessage("Comment must be less than 500 characters"),
], validate, videoController.addComentsOnVideo)

router.post('/:id/deletecomments', authMiddleware, videoController.deleteComment)

router.post('/:id/togglecommentlike', authMiddleware, videoController.toggleCommentLike)

router.post('/:id/updatecomments', authMiddleware, videoController.editComment)

router.get('/comment/:id/replies', authMiddleware, videoController.getCommentsReplies)

module.exports = router;
