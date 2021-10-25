const {model, Schema} = require('mongoose');



const schema = new Schema({
    email:{type: String, required: true},
    username: {type: String, minLength: [5, 'The length must be at least 5 characters.'], required: true},
    hashedPassword: {type: String, minLength: [7, 'The length must be at least 7 characters.'], required: true},
    
})


module.exports = model('User', schema)