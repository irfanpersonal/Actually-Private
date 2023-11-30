import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {logoutUser} from '../features/user/userThunk.js';
import {isEditingFalse} from '../features/profile/profileSlice.js';
import {EditProfile, ProfileData, PostList} from '../components/index.js';
import {getUserProfileData} from '../features/profile/profileThunk.js';
import {getCurrentUserPosts} from '../features/posts/postsThunk.js';
import {Modal} from '../components';

const UserProfile = () => {
    const dispatch = useDispatch();
    const {isLoadingUserPosts, posts} = useSelector(store => store.posts); 
    const {isEditing, isLoadingUserData, user: currentUser} = useSelector(store => store.profile);
    const {showModal} = useSelector(store => store.modal);
    const {user} = useSelector(store => store.user);
    React.useEffect(() => {
        dispatch(isEditingFalse());
        dispatch(getUserProfileData(user.userID));
        dispatch(getCurrentUserPosts());
    }, []);
    return (
        <Wrapper>
            <h1 style={{textAlign: 'center', backgroundColor: 'lightblue', marginBottom: '1rem'}}>Profile</h1>
            {isEditing ? (
                <EditProfile/>
            ) : (
                <>
                    {isLoadingUserData ? (
                        <h1>Loading User Data...</h1>
                    ) : (
                        <ProfileData data={currentUser}/>
                    )}
                </>
            )}
            {isLoadingUserPosts ? (
                <h1>Loading User Posts...</h1>
            ) : (
                <PostList title="My Posts" data={posts}/>
            )}
            <button type="button" onClick={() => dispatch(logoutUser())}>Logout</button>
            {showModal && <Modal/>}
        </Wrapper>
    );
}

const Wrapper = styled.div` 
    button > a {
        text-decoration: none;
        color: black;
        font-size: 1rem;
    }
    button {
        width: 100%;
        padding: 0.5rem;
        border: none;
        background-color: lightcoral;
    }
    button:hover {
        outline: 1px solid black;
    }
    button:active {
        background-color: white;
    }
    .container {
        border: 1px solid black;
        padding: 1rem;
        margin: 1rem 0;
    }
    img {
        width: 50px;
        height: 50px;
    }
    p {
        background-color: lightgray;
        padding: 1rem;
        margin: 1rem 0;
    }
`;  

export default UserProfile;