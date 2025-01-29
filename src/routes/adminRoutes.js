const express = require('express');
const { adminController } = require('../controllers/index');
const router = express.Router();
const authMiddleware  = require('../middleware/authMiddleware');


router.route('/').get(authMiddleware(), adminController.getUsers);
router.route('/get-payments').get(authMiddleware(), adminController.getPayments);

module.exports = router;