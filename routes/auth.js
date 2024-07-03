const express = require("express");
const router = express.Router();
const loginController = require("../controllers/authController");

router.post('/generateToken',loginController.token);

router.post('/secureAPI',loginController.secureAPI);

router.post('/login',loginController.login);

module.exports = router;