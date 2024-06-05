const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const {roles} = require('../config/roles');
const { required } = require('joi');
const { default: isEmail } = require('validator/lib/isEmail');


const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim: true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Invalid email');
                }
            },
        },
        password:{
            type:String,
            required:true,
            trim:true,
            minlength:8,
            validate(value){
                if(value.toLowerCase().includes('password')){
                    throw new Error('Password cannot contain "password"');
                }else if(!value.match(/\d/) || !value.match(/[a-zA-Z]/)){
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
            private:true, // to be skipped when converting to JSON
        },
        role:{
            type:String,
            enum:roles,
            default:'user',
        },
        isEmailVerified:{
            type:Boolean,
            default:false,
        },
        },
        {
            timestamps:true,
        }
)

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate)

// Check if email is taken
userSchema.statics.isEmailTaken = async function(email, excludeUserId){
    const user = await this.findOne({email, _id: {$ne: excludeUserId}});
    return !!user;
}

// Check if password matches the user's password
userSchema.methods.isPasswordMatch = async function(password){
    const user = this;
    return bcrypt.compare(password, user.password);
}

// Hash the password before saving
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;