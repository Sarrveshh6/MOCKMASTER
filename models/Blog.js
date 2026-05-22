const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    excerpt: {
        type: String,
        required: [true, 'Please add an excerpt'],
        maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    author: {
        type: String,
        default: 'MockMaster Team'
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    color: {
        type: String,
        default: 'var(--bg-orange)'
    },
    image: {
        type: String
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blog', blogSchema);
