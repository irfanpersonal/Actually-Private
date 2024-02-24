import {configureStore} from '@reduxjs/toolkit';
import navigationReducer from './features/navigation/navigationSlice';
import userReducer from './features/user/userSlice';
import profileReducer from './features/profile/profileSlice';
import postReducer from './features/post/postSlice';
import singlePostReducer from './features/singlePost/singlePostSlice';
import singleUserReducer from './features/singleUser/singleUserSlice';
import followRequestsReducer from './features/followRequests/followRequestsSlice';
import exploreReducer from './features/explore/exploreSlice';
import searchReducer from './features/search/searchSlice';
import userFeedReducer from './features/userFeed/userFeedSlice';
import adminReducer from './features/admin/adminSlice';

const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        user: userReducer,
        profile: profileReducer,
        post: postReducer,
        singlePost: singlePostReducer,
        singleUser: singleUserReducer,
        followRequests: followRequestsReducer,
        explore: exploreReducer,
        search: searchReducer,
        userFeed: userFeedReducer,
        admin: adminReducer
    }
});

export type useDispatchType = typeof store.dispatch;

export type useSelectorType = ReturnType<typeof store.getState>;

export default store;