
const router = require('express').Router();

const { body, validationResult } = require('express-validator')

const { isUser } = require('../middlewares/guards')




router.get('/create', isUser(), (req, res) => {
    res.render('create')
})


router.post('/create', isUser(), async (req, res) => {
    let blogData = {
        title: req.body.title,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        author: req.user._id,
    }

    try {
        await req.storage.createBlog(blogData)
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
        res.redirect('/blog/create')
    }

})

router.get('/details/:id', async (req, res) => {

    try {
        const postData = await req.storage.getBlogById(req.params.id);
        
        postData.comments = postData.comments.map(x => {
            return {author: x.author.username, comment: x.comment}
        })
        
        postData.createdAt = postData.createdAt.toISOString().split('T')[0]
        postData.likes = Array.from(postData.likedBy).length;
        postData.dislikes = Array.from(postData.dislikedBy).length;
        res.render('details', { postData })

    } catch (error) {
        console.log(error.message);
        res.redirect('/')
    }
})

router.get('/like/:id', isUser(), async (req, res) => {

    try {
        const blog = await req.storage.getBlogById(req.params.id);
        let example = blog.likedBy.map(x => x.toString());
        if(example.includes(req.user._id)){
            throw new Error('You can not like article which you have already liked!')
        }

        await req.storage.likeBlog(req.params.id, req.user._id)


        res.redirect('/blog/details/' + req.params.id)
    } catch (err) {
        console.log(err.message);
        res.redirect('/blog/details/' + req.params.id)
    }
})
router.get('/dislike/:id', isUser(), async (req, res) => {

    try {
        const blog = await req.storage.getBlogById(req.params.id);

        let example = blog.dislikedBy.map(x => x.toString());
        if(example.includes(req.user._id)){
            throw new Error('You can not dislike article which you have already disliked!')
        }


        await req.storage.dislikeBlog(req.params.id, req.user._id)



        res.redirect('/blog/details/' + req.params.id)
    } catch (err) {
        console.log(err.message);
        res.redirect('/blog/details/' + req.params.id)
    }
})

router.get('/favourites', isUser(), async (req, res) => {

    try {
        
        let data = await req.storage.getFavourites(req.user._id);

        res.render('partials/favourite', { data })
    } catch (err) {
        console.log(err.message);
        res.redirect('/')
    }
})
router.get('/favourites/:id', isUser(), async (req, res) => {

    try {
        let blog = await req.storage.getBlogById(req.params.id);
        
        let example = blog.addedToFavourites.map(x => x.toString());
        if(example.includes(req.user._id)){
            throw new Error('You have this article already in favourites!')
        }

        await req.storage.addToFavourite(req.params.id, req.user._id);
        res.redirect('/');

    } catch (err) {
        console.log(err.message);
        res.redirect('/')
    }
})


router.get('/comment/:id', isUser(), async (req, res) => {

    try {
        if(req.query.comment == ''){
            throw new Error("Can not put empty comment!")
        }
        await req.storage.addComment(req.query.comment, req.params.id, req.user._id);
        
        res.redirect('/blog/details/' + req.params.id);

    } catch (err) {
        
        console.log(err.message);
        res.redirect('/blog/details/' + req.params.id);
    }
})


module.exports = router;