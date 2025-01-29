const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authController } = require('../controllers/index');
const validate = require('../middleware/validate')
const authValidation = require('../validator/authValidation');
const router = express.Router();


router.route('/register').post(validate(authValidation.register),authController.register);
router.route('/login').post(validate(authValidation.login),authController.login);
router.route('/logout').get(authMiddleware(),authController.logout);

module.exports = router;