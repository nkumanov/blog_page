const mongoose = require('mongoose');

module.exports = (app) => {
    return new Promise((resolve,reject) => {
        mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true });
        const db = mongoose.connection;
        db.on('error', (err) => {
            console.error('connection error:', err);
            reject(err)
        });
        

        db.once('open', function () {
            // we're connected!
            console.log('Database ready');
            resolve()
        });
    })
}