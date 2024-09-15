const Joi = require('joi');

const startPayment = {
    body: Joi.object().keys({
      user_token: Joi.string().required(),
      amount: Joi.number().required(),
      item: Joi.string().required(),
      currency: Joi.string().required(),
    }),
  };


  module.exports = {
    startPayment,
  };