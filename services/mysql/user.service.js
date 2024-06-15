const httpStatus = require('http-status');
const {MsqlUser} = require('../../models');
const ApiError = require('../../utils/ApiError');
const logger = require('../../config/logger');

// Create a new user
const createUser = async (userBody) => {
    try {
        if(await MsqlUser.isEmailTaken(userBody.email)){
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        return MsqlUser.create(userBody);
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

// Get all users
const getUsers = async(filter, options) =>{
    try {
        const users = await MsqlUser.paginate(filter, options);
        return users;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

// Get user by id
const getUserById = async(userId) =>{
    try {
        return MsqlUser.findOne({userId});
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

// Get user by email
const getUserByEmail = async(email) =>{
    try {
        return MsqlUser.findOne({where:{email}});
    } catch (error) {
        logger.error(error);
        throw error;
    }
}   

// Update user by id
const updateUserById = async(userId, updateBody) =>{
    try {
        const user = await getUserById(userId);
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        if(updateBody.email && (await MsqlUser.isEmailTaken(updateBody.email, userId))){
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        Object.assign(user, updateBody);
        await user.save();
        return user;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

// Delete user by id
const deleteUserById = async(userId) =>{
    try {
        const user = await getUserById(userId);
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        await user.destroy({force: true});
        return user;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
}