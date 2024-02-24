import express from 'express';
const router: express.Router = express.Router();

import {getUserFeed, createPost, getSinglePost, getSinglePostComments, updateSinglePost, deleteSinglePost, likePost, unlikePost, getTrendingTopics, globalSearch} from '../controllers/post';
import {createSingleComment, getSingleComment, updateSingleComment, deleteSingleComment, likeComment, unlikeComment} from '../controllers/comment';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';

router.route('/').post(authentication, restrictFunctionalityTo('user'), createPost);
router.route('/globalSearch').get(authentication, restrictFunctionalityTo('user'), globalSearch);
router.route('/trending').get(authentication, restrictFunctionalityTo('user'), getTrendingTopics);
router.route('/userFeed').get(authentication, restrictFunctionalityTo('user'), getUserFeed);
router.route('/:id/comments').get(authentication, restrictFunctionalityTo('user'), getSinglePostComments);
router.route('/:id/like').post(authentication, restrictFunctionalityTo('user'), likePost);
router.route('/:id/unlike').delete(authentication, restrictFunctionalityTo('user'), unlikePost);
router.route('/:id/comment').post(authentication, restrictFunctionalityTo('user'), createSingleComment);
router.route('/:id/comment/:commentID').get(authentication, restrictFunctionalityTo('user'), getSingleComment);
router.route('/:id/comment/:commentID').patch(authentication, restrictFunctionalityTo('user'), updateSingleComment);
router.route('/:id/comment/:commentID').delete(authentication, restrictFunctionalityTo('user'), deleteSingleComment);
router.route('/:id/comment/:commentID/like').post(authentication, restrictFunctionalityTo('user'), likeComment);
router.route('/:id/comment/:commentID/unlike').delete(authentication, restrictFunctionalityTo('user'), unlikeComment);
router.route('/:id').get(authentication, restrictFunctionalityTo('user'), getSinglePost).patch(authentication, restrictFunctionalityTo('user'), updateSinglePost).delete(authentication, restrictFunctionalityTo('user'), deleteSinglePost);

export default router;