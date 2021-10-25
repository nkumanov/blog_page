const UserModel = require('../models/User')


async function createUser(email,username, hashedPassword) {

    const user = new UserModel({
        email,
        username,
        hashedPassword
    });
    await user.save();
    return user;
}

async function getUserByUsername(username) {
    const pattern = new RegExp(`^${username}$`, 'i')
    const user = await UserModel.findOne({ username: { $regex: pattern } });

    return user;
}

async function getUserById(id){
    const user = await UserModel.findById(id);
    return user;
}
async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i')
    const user = await UserModel.findOne({ email: { $regex: pattern } });

    return user;
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserByEmail,
    getUserById
}