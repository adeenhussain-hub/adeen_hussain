const express = require("express");
const { body, header } = require("express-validator");
const authController = require("../controllers/authController");
// const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',
  [
    body("username")
      .notEmpty().withMessage("Username is required")
      .isString().withMessage("Username must be text"),
    body("email")
      .isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
      .isString().withMessage("Password must be text"),
  ], authController.register
)

router.post('/login', [
  body("email")
    .if((value, { req }) => !req.headers["authorization"])
    .isEmail().withMessage("Valid email is required"),
  body("password")
    .if((value, { req }) => !req.headers["authorization"])
    .notEmpty().withMessage("Password is required")
    .isString().withMessage("Password must be text"),
], authController.login
)

router.post('/refresh',
  header("authorization").notEmpty().withMessage("Token is required")
  , authController.refresh)

module.exports = router;
