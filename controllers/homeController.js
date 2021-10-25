
const router = require('express').Router();


router.get('/', async (req, res) => {
    try {
        let data = await req.storage.getBlogs();

        res.render('home', { data })
    } catch (error) {
        console.log(error.message);
        res.redirect('/404')
    }

})
router.get('/about', (req, res) => {
    res.render('about')
})
module.exports = router;