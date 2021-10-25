
const BlogModel = require('../models/Blog')


async function getBlogs() {
    let result = await BlogModel.find({}).populate('author').lean();
    result.map(x => x.comments = x.comments.length);
    return result;
}

async function getBlogById(id) {
    return await BlogModel.findById(id).populate({
        'path':'comments',
        populate: {'path': 'author'}
    }).lean();
}


async function createBlog(blogData) {
    const newBlog = new BlogModel(blogData);
    await newBlog.save();

    return newBlog;
}


async function deleteBlog(id) {
    return BlogModel.findByIdAndDelete(id);
}

async function likeBlog(blogId, userId) {
    const blog = await BlogModel.findById(blogId);
    blog.dislikedBy = blog.dislikedBy.filter(item => item !== userId);
    blog.dislikedBy = blog.dislikedBy.filter(x => x != userId);
    blog.likedBy.push(userId);
    return blog.save();
}
async function dislikeBlog(blogId, userId) {
    const blog = await BlogModel.findById(blogId);

    blog.likedBy = blog.likedBy.filter(x => x != userId);

    blog.dislikedBy.push(userId);
    return blog.save();
}

async function getBlogsByCategory(category) {
    let result = await BlogModel.find({ category: category }).populate('author').lean();

    result.map(x => x.comments = x.comments.length);

    return result;
}
async function addToFavourite(blogId, userId) {
    let blog = await BlogModel.findById(blogId);
    console.log(blog);
    blog.addedToFavourites.push(userId);
    return blog.save()

}
async function getFavourites(userId) {
    let result = await BlogModel.find({}).populate('author').lean();
    let blogs = []

    result.forEach(item => {

        let example = item.addedToFavourites.map(x => x.toString());
        if (example.includes(userId)) {

            item.comments = item.comments.length;

            blogs.push(item)
        }

    })


    return blogs;
}

async function addComment(comment, blogId, userId) {
    const blog = await BlogModel.findById(blogId);
    
    
    blog.comments.push({
        author: userId,
        comment: comment
    })
    console.log(blog)
    return blog.save();
}
module.exports = {
    getBlogs,
    getBlogById,
    createBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    getBlogsByCategory,
    addToFavourite,
    getFavourites,
    addComment
}