const express = require("express");
const { body, header, param } = require("express-validator");
const profileController = require("../controllers/profileController");
const authMiddleware = require('../middlewares/authMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');
const router = express.Router();

router.post('/:id/follow',authMiddleware,profileController.follow)
router.post('/:id/unfollow',authMiddleware,profileController.unFollow)

router.get('/:id/followings',optionalAuthMiddleware, profileController.getAllFollowingsByID)
router.get('/:id/followers',optionalAuthMiddleware, profileController.getAllFollowerssByID)
router.get('/:id/stats',optionalAuthMiddleware, profileController.stats)

router.post('/:id/block',authMiddleware,profileController.block)
router.post('/:id/unblock',authMiddleware,profileController.unBlock)


module.exports = router;
