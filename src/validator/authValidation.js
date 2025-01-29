const Joi = require('joi');

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};
const register = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
    userEmail: Joi.string().email().required(),
    userPassword: Joi.string().min(6).required(),
    userMobile: Joi.number().required(),
    userAddress: Joi.string().optional(),
  }),
};

  module.exports = {
    login,
    register
  };