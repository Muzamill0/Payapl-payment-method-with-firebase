const express = require('express');
const paymentValidation = require('../validator/index');
const { paymentController } = require('../controllers/index');
const router = express.Router();


router.route('/start-payment').get(paymentController.startPayment);
router.route('/success').get(paymentController.paymentSuccess);
router.route('/cancel').get(paymentController.paymentCancel);

module.exports = router;