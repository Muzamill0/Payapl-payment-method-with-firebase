const express = require('express');
const { authController } = require('../controllers/index');
const router = express.Router();


router.route('/login').post(authController.login);

module.exports = router;