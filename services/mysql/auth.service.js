const userService = require('./user.service');
const tokenService = require('./token.service');
const {MsqlToken} = require('../../models');
const ApiError = require('../../utils/ApiError');
const { tokenTypes } = require('../../config/tokens');
const httpStatus = require('http-status');


// Login with email and password
const loginWithEmailAndPassword = async(email, password)=>{
    const user = await userService.getUserByEmail(email);
     
    if(!user || !(await user.isPasswordMatch(password))){
      // console.log(user)
      // console.log(IsPasswordMatch)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
}

// Logout
const logout = async(refreshToken)=>{
    const refreshTokenDoc = await MsqlToken.findOne({token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false});
    if(!refreshTokenDoc){
        throw new ApiError(httpStatus.NOT_FOUND, 'Invalid or expired refresh token');
    }
    await refreshTokenDoc.destroy({force: true});
}

// Refresh auth tokens
const refreshAuth = async (refreshToken) => {
    try {
      const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
      const user = await userService.getUserById(refreshTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      await refreshTokenDoc.destroy({force: true});
      return tokenService.generateAuthTokens(user);
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  };

// Reset password
const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
      const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
      console.log(resetPasswordTokenDoc.dataValues.userId)
      const user = await userService.getUserById(resetPasswordTokenDoc.dataValues.userId);
      if (!user) {
        throw new Error();
      }
      await userService.updateUserById(user.id, { password: newPassword });
      await MsqlToken.destroy({where: {userId: user.id, type: tokenTypes.RESET_PASSWORD}});
    } catch (error) {
      console.log(error)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
  };

  // verify email
  const verifyEmail = async (verifyEmailToken) => {
    try {
        const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
        const user = await userService.getUserById(verifyEmailTokenDoc.user);
        if (!user) {
          throw new Error();
        }
        await MsqlToken.destroy({where: {userId: user.id, type: tokenTypes.VERIFY_EMAIL}});
        await userService.updateUserById(user.id, { isEmailVerified: true });
    }
    catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
    }

module.exports = {
    loginWithEmailAndPassword,
    logout,
    refreshAuth,
    resetPassword,
    verifyEmail,
};