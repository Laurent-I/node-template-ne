const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);

if(config.env !== 'test'){
    transport
        .verify()
        .then(()=> logger.info('Connected to email server'))
        .catch(()=> logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in the .env file'));
}

// Send an email
const sendEmail = async(to, subject, text)=> {
    const msg = {from: config.email.from, to, subject, text};
    await transport.sendMail(msg);
}

// Send password reset email
const sendPasswordResetEmail = async(to, token)=>{
    const subject = 'Reset your password';
    const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}`;
    const text = `Dear User,
    To reset your password, click on this link: ${resetPasswordUrl}
    If you did not request a password reset, please ignore this email.
    `;
    await sendEmail(to, subject, text);
};

// Send email verification email
const sendVerificationEmail = async(to, token)=>{
    const subject = 'Email Verification';
    const verificationEmailUrl = `http://localhost:3000/reset-password?token=${token}`;
    const text = `Dear user,
    To verify your email, click on this link: ${verificationEmailUrl}
    If you did not create an account, then ignore this email.`;
    await sendEmail(to, subject, text);
}

module.exports = {
    sendEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
}