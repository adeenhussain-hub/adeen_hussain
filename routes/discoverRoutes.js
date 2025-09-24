const express = require("express");
const { body, header, param } = require("express-validator");
const discoverController = require("../controllers/discoverController");
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/showfeed',authMiddleware,discoverController.showFeed)
router.get('/trending',authMiddleware,discoverController.showTrendingFeed)
router.get('/sugesstedUsers',authMiddleware,discoverController.suggestedUser)


module.exports = router;
