const Joi = require('joi');
const {password} = require('./custom.validation');
const { query } = require('express');

const register = {
    body:Joi.object().keys({
        email:Joi.string().required().email(),
        password:Joi.string().required().custom(password),
        name:Joi.string().required(),
    }),
}

const login = {
    body:Joi.object().keys({
        email:Joi.string().required().email(),
        password:Joi.string().required(),
    }),
}

const refreshToken = {
    body:Joi.object().keys({
        refreshToken:Joi.string().required(),
    }),
}

const forgotPassword = {
    body:Joi.object().keys({
        email:Joi.string().required().email(),
    }),
}

const resetPassword = {
    query:Joi.object().keys({
        token:Joi.string().required(),
    }),
    body:Joi.object().keys({
        password:Joi.string().required().custom(password),
    }),
}

const verifyEmail = {
    query:Joi.object().keys({
        token:Joi.string().required(),
    }),
}

module.exports = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };