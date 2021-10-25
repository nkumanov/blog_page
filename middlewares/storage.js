const blogService = require('../services/blogs')


module.exports = () => (req, res, next) => {
    req.storage = {
        ...blogService
    }

    next()
}