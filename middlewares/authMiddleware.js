

const userService = require('../services/user.js')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const { TOKEN_SECRET, COOKIE_NAME } = require('../config/index')


module.exports = () => (req, res, next) => {
    if (parseToken(req, res)) {

        req.auth = {
            async register(email, username, hashedpassword) {
                const token = await register(email, username, hashedpassword);
                res.cookie(COOKIE_NAME, token)
            },
            async login(username, password) {
                const token = await login(username, password);
                res.cookie(COOKIE_NAME, token)
            },
            
            logout: () => {
                res.clearCookie(COOKIE_NAME)
            }
        }

        next()
    }
}

async function login(username, password) {
    const existing = await userService.getUserByUsername(username);
    if (!existing) {
        throw new Error('No such user!')
    }

    const hasMatch = await bcrypt.compare(password, existing.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorrect password!')
    }

    return generateToken(existing)
}
async function register(email, username, password) {
    const existing = await userService.getUserByEmail(email);

    if (existing) {
        throw new Error('Email is already existing.')
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser(email, username, hashedPassword);
    return generateToken(user)
}

function generateToken(userData) {
    const token = jwt.sign({
        _id: userData._id,
        username: userData.username
    }, TOKEN_SECRET);
    return token
}

function parseToken(req, res) {
    const token = req.cookies[COOKIE_NAME];

    if (token) {
        try {
            const userData = jwt.verify(token, TOKEN_SECRET)
            req.user = userData;
            res.locals.user = userData;
            return true
        } catch (error) {
            res.clearCookie(COOKIE_NAME);
            res.redirect('/auth/login')
            return false;
        }
    }
    return true;
}