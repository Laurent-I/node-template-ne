const {version} = require('../package.json')
const config = require('../config/config')

const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'nodejs-template-national-exams',
        version,
        license:{
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'   
        }
    },
    servers:[
        {
            url:`http://localhost:${config.port}/v1`,
        }
    ]
}

module.exports = swaggerDef