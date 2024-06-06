const {Strategy:JwtStrategy, ExtractJwt} = require('passport-jwt');
const config = require('./config')
const {User} = require('../models')
const {tokenTypes} = require('./tokens')

const jwtOptions = {
    secertOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

const jwtVerify = async (payload, done)=>{
    try {
        if(payload.type !== tokenTypes.ACCESS){
            throw new Error('Invalid token type')
        }
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
    } catch (error) {
        done(error, false);
    }
}

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy
}