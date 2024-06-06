const {Sequelize} = require('sequelize');
const {mysql, postgres}  = require('../config')

const mysqlSequelize = new Sequelize(`${mysql.database}, ${mysql.user}, ${mysql.password}`,{
    host:mysql.host,
    port:mysql.port,
    dialect:'mysql',
    define:{
        freezeTableName:true
    }
})

const postgresSequelize = new Sequelize(`${postgres.database}, ${postgres.user}, ${postgres.password}`,{
    host:postgres.host,
    port:postgres.port,
    dialect:'postgres',
    define:{
        freezeTableName:true
    }
})

module.exports ={
    mysqlSequelize,
    postgresSequelize
}