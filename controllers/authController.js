
const router = require('express').Router();

const { body, validationResult } = require('express-validator')

const { isGuest } = require('../middlewares/guards')

router.get('/login', isGuest(), (req, res) => {
    res.render('login')
})
router.get('/register', isGuest(), (req, res) => {
    res.render('register')
})





router.post('/login',
    isGuest(),
    async (req, res) => {

        try {
            await req.auth.login(req.body.username, req.body.password)
            res.redirect('/')
        } catch (error) {
            if(error.message === 'No such user!' || error.message === 'Incorrect password!'){
                error.message = 'Wrong username or password!'
            }
            const ctx = {
                errors: [error.message],
                userData: {
                    username: req.body.username,
    
                }
            }
            res.render('login', ctx)
        }
    })
router.post('/register', isGuest(),
    body('email').isEmail().normalizeEmail().withMessage('Please enter valid email address!'),
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long!'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long!'),
    body('rePass').custom((value, {req}) => {
        if(value != req.body.password){
            throw new Error('Passwords do not match!')
        }
        return true;
    }),
    async (req, res) => {
        const {errors} = validationResult(req)
        try {
            if(errors.length > 0){
                throw new Error(Object.values(errors).map(e => e.msg).join('\n'))
                
            }
            await req.auth.register(req.body.email, req.body.username, req.body.password);
            res.redirect('/')
        } catch (err) {
            console.log(err);
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    username: req.body.username,
                    email: req.body.email
                }
            }
            
            res.render('register', ctx)
        }
    })


router.get('/logout', async (req, res) => {
    req.auth.logout();
    res.redirect('/')
})
module.exports = router;