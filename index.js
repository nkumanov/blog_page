

const express = require('express')
const expressConfig = require('./config/express.js')
const databaseConfig = require('./config/database')
const router = require('./config/router')

async function start(){
    const app = express();
    await databaseConfig(app)
    expressConfig(app)

    router(app)


    app.listen(3000, console.log('Server is listening on port 3000'))
}   

start()