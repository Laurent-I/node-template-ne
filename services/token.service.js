const jwt = require('jsonwebtoken');
const moment = require('moment');
const { tokenTypes } = require('../config/tokens');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

// Generate token
const generateToken = (userId, expires, type, secret=config.jwt.secret)=>{
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
}

// Save a token
const saveToken = async(token, userId, expires, type, blacklisted=false)=>{
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
}

// verify token and return token doc (if not blacklisted)
const verifyToken = async(token, type)=>{
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({token, type, user: payload.sub, blacklisted: false});
    if(!tokenDoc){
        throw new Error('Token not found');
    }
    return tokenDoc;
}

// Generate auth tokens
const generateAuthTokens = async(user)=>{
    let refreshTokenDoc = await Token.findOne({ user: user._id });
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    if (!refreshTokenDoc) {
        const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
        await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);
    
        refreshTokenDoc = {};
        refreshTokenDoc.token = refreshToken;
      }

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshTokenDoc.token,
            expires: refreshTokenExpires.toDate(),
        },
    }
}

// Generate reset password token
const generateResetPasswordToken = async(email)=>{
    const user = await userService.getUserByEmail(email);
    if(!user){
        throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
}

// Generate verify email token
const generateVerifyEmailToken = async (user) => {
    console.log(user)
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
  };

module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
}