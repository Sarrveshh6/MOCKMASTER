const express = require('express');
const {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blogController');

const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getBlogs)
    .post(protect, admin, createBlog);

router.route('/:id')
    .get(getBlog)
    .put(protect, admin, updateBlog)
    .delete(protect, admin, deleteBlog);

module.exports = router;
