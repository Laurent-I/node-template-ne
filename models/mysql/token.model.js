const {DataTypes} = require('sequelize');
const {mysqlSequelize} = require('../../config/db/sequelize');
const {tokenTypes} = require('../../config/tokens');

const Token = mysqlSequelize.define('Token', {
    token:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
        },
    },
    type: {
        type:DataTypes.ENUM,
        values: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
        allowNull: false,
    },
    expires:{
        type:DataTypes.DATE,
        allowNull: false,
    },
    blacklisted:{
        type:DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
})

module.exports = Token;