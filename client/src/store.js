import {configureStore} from "@reduxjs/toolkit";
import userReducer from './features/user/userSlice.js';
import profileReducer from './features/profile/profileSlice.js';
import otherProfileReducer from './features/otherProfile/otherProfileSlice.js';
import commentReducer from './features/comment/commentSlice.js';
import postsReducer from './features/posts/postsSlice.js';
import postReducer from './features/post/postSlice.js';
import addPostReducer from './features/addPost/addPostSlice.js';
import searchReducer from './features/search/searchSlice.js';
import modalReducer from './features/modal/modalSlice.js';

const store = configureStore({
    reducer: {
        user: userReducer,
        profile: profileReducer,
        otherProfile: otherProfileReducer,
        comment: commentReducer,
        posts: postsReducer,
        post: postReducer,
        addPost: addPostReducer,
        search: searchReducer,
        modal: modalReducer
    }
});

export default store;