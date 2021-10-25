const {model, Schema} = require('mongoose');



const schema = new Schema({
    title: {type: String, required: true},
    category: {type: String, required: true},
    imageUrl: {type: String, required: true},
    description: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    comments: [{
        author: {type: Schema.Types.ObjectId, ref: 'User'},
        comment: {type: String, required: true}, default: []
    }],
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    dislikedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    addedToFavourites: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
})


module.exports = model('Blog', schema)