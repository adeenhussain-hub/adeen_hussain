const express = require("express");
const { body, header, param } = require("express-validator");
const storyController = require("../controllers/storyController");
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require("../middlewares/validate");
const upload = require('../middlewares/uploadVideoMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, upload.single("videoPath"), [
    body("title").notEmpty().withMessage("Title is required").isLength({ max: 255 }).withMessage("Title must be less than 255 characters"),
    body("description").optional().isLength({ max: 1000 }).withMessage("Description must be less than 1000 characters"),
], validate, storyController.createVideo)


module.exports = router;
