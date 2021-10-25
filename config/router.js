

const homeController = require('../controllers/homeController')
const authController = require('../controllers/authController')
const blogController = require('../controllers/blogController')
const categoryController = require('../controllers/categoryController')
module.exports  = (app) => {

    app.use('/auth', authController)
    app.use('/blog' , blogController)
    app.use('/category' , categoryController)
    app.use('/', homeController)
    app.use('*', (req,res) => {
        res.send('<h1>Error 404, not found!</h1>')
    })
}