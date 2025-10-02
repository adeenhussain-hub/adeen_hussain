const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const msgController = require("../controllers/msgContoller");

router.get("/:id", authMiddleware, msgController.getChatHistory);

module.exports = router;
