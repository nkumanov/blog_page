
const router = require('express').Router();


router.get('/:category', async (req, res) => {
    try {
        let data = await req.storage.getBlogsByCategory(req.params.category);
        
        res.render('home', { data })
    } catch (error) {
        console.log(error.message);
        res.redirect('/404')
    }

})

module.exports = router;