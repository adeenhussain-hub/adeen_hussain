const express = require("express");
const { body, header } = require("express-validator");
const authController = require("../controllers/authController");
// const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',   [
  body("username").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],authController.register
)

  router.post('/login',[
    body("email").if((value, { req }) => !req.headers["authorization"]).isEmail().withMessage("Valid email is required"),
    body("password").if((value, { req }) => !req.headers["authorization"]).notEmpty().withMessage("Password is required"),
  ],authController.login
)

router.post('/refresh', 
  header("authorization").notEmpty().withMessage("Token is required")
,authController.refresh)

module.exports = router;
