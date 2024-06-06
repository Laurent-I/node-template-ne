const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    skipSuccessfulRequests: true
});

module.exports = {
    authLimiter
}