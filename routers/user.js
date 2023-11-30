const express = require('express');
const router = express.Router();

const {getAllUsers, showCurrentUser, getSingleUser, updateUser, updateUserPassword, followUser, unfollowUser} = require('../controllers/user.js');
const authentication = require('../middleware/authentication.js');

router.route('/').get(getAllUsers);
router.route('/showCurrentUser').get(authentication, showCurrentUser);
router.route('/updateUser').patch(authentication, updateUser);
router.route('/updateUserPassword').patch(authentication, updateUserPassword);
router.route('/followUser/:id').post(authentication, followUser);
router.route('/unfollowUser/:id').post(authentication, unfollowUser);
router.route('/:id').get(getSingleUser);

module.exports = router;