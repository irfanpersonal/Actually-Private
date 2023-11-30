const express = require('express');
const router = express.Router();

const {createComment, getNestedComments, createNestedComment, getSingleComment, updateSingleComment, deleteSingleComment, likeComment, unlikeComment} = require('../controllers/comment.js');
const authentication = require('../middleware/authentication.js');

router.route('/create/:postID').post(authentication, createComment);
router.route('/create/:postID/:parentCommentID').post(authentication, createNestedComment).get(getNestedComments);
router.route('/likeComment/:commentID').post(authentication, likeComment);
router.route('/unlikeComment/:commentID').post(authentication, unlikeComment);
router.route('/:id').get(getSingleComment).patch(authentication, updateSingleComment).delete(authentication, deleteSingleComment);

module.exports = router;