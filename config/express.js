const express = require('express')

var hbs = require('express-handlebars');
const authMiddleware = require('../middlewares/authMiddleware')
const cookiepParser = require('cookie-parser')

const storageMiddleware = require('../middlewares/storage')

module.exports = (app) => {
    app.engine('hbs', hbs({
        extname: 'hbs'
    }))
    
    app.set('view engine', 'hbs');

    app.use('/static', express.static('static'))
    app.use(express.urlencoded({extended: true}));
    app.use(cookiepParser())
    app.use(authMiddleware())
    
    

    app.use((req,res,next) => {
        console.log('>>>', req.method,req.url);
        if(req.user){
            console.log('Known user', req.user.username);
        }
        next()
    })
    app.use(storageMiddleware())
}