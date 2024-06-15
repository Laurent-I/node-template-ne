const httpStatus = require('http-status');
const {MsqlUser} = require('../models');
const ApiError = require('../utils/ApiError');

// Create a new user
const createUser = async (userBody) => {
    if(await MsqlUser.isEmailTaken(userBody.email)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return MsqlUser.create(userBody);
}

// Get all users
const getUsers = async(filter, options) =>{
    const users = await MsqlUser.paginate(filter, options);
    return users;
}

// Get user by id
const getUserById = async(userId) =>{
    return MsqlUser.findOne({userId});
}

// Get user by email
const getUserByEmail = async(email) =>{
    return MsqlUser.findOne({email});
}   

// Update user by id
const updateUserById = async(userId, updateBody) =>{
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
}

// Delete user by id
const deleteUserById = async(userId) =>{
    const user = await getUserById(userId);
    if(!user){
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.destroy({force: true});
    return user;
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
}