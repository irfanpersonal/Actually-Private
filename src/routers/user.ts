import express from 'express';
const router: express.Router = express.Router();

import {showCurrentUser, getProfileData, getAllUsers, getSingleUser, updateUser, updateUserPassword} from '../controllers/user';
import {followUser, createFollowRequest, deleteFollowRequest, viewAllFollowRequests, updateFollowRequest, unfollowUser} from '../controllers/follow';
import {blockUser, unblockUser} from '../controllers/block';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';
import {getUsersPosts, getSingleUserPosts} from '../controllers/post';

router.route('/').get(authentication, getAllUsers);
router.route('/getProfileData').get(authentication, restrictFunctionalityTo('user'), getProfileData);
router.route('/getUsersPosts').get(authentication, restrictFunctionalityTo('user'), getUsersPosts);
router.route('/updateUser').patch(authentication, restrictFunctionalityTo('user'), updateUser);
router.route('/updateUserPassword').patch(authentication, restrictFunctionalityTo('user'), updateUserPassword);
router.route('/showCurrentUser').get(authentication, showCurrentUser);
router.route('/viewAllFollowRequests').get(authentication, restrictFunctionalityTo('user'), viewAllFollowRequests);
router.route('/viewAllFollowRequests/:id').patch(authentication, restrictFunctionalityTo('user'), updateFollowRequest);
router.route('/:id/getSingleUserPosts').get(authentication, restrictFunctionalityTo('user'), getSingleUserPosts);
router.route('/:id/followRequest').post(authentication, restrictFunctionalityTo('user'), createFollowRequest);
router.route('/:id/followRequest').delete(authentication, restrictFunctionalityTo('user'), deleteFollowRequest);
router.route('/:id/follow').post(authentication, restrictFunctionalityTo('user'), followUser);
router.route('/:id/unfollow').delete(authentication, restrictFunctionalityTo('user'), unfollowUser);
router.route('/:id/block').post(authentication, restrictFunctionalityTo('user'), blockUser);
router.route('/:id/unblock').delete(authentication, restrictFunctionalityTo('user'), unblockUser);
router.route('/:id').get(authentication, restrictFunctionalityTo('user'), getSingleUser);

export default router;