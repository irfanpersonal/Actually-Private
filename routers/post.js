const express = require('express');
const router = express.Router();

const {getAllPosts, userFeed, getCurrentUserPosts, getPostsFromUser, createPost, likePost, unlikePost, getSinglePost, updateSinglePost, deleteSinglePost} = require('../controllers/post.js');
const {getSinglePostComments} = require('../controllers/comment.js');
const authentication = require('../middleware/authentication.js');

router.route('/').get(getAllPosts).post(authentication, createPost);
router.route('/userFeed').get(authentication, userFeed);
router.route('/getCurrentUserPosts').get(authentication, getCurrentUserPosts);
router.route('/getPostsFromUser/:id').get(getPostsFromUser);
router.route('/likePost/:id').post(authentication, likePost);
router.route('/unlikePost/:id').post(authentication, unlikePost);
router.route('/:id').get(getSinglePost).patch(authentication, updateSinglePost).delete(authentication, deleteSinglePost);
router.route('/:id/comments').get(getSinglePostComments);

module.exports = router;