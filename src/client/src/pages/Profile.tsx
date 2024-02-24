import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {logoutUser} from '../features/user/userThunk';
import {Loading, FollowRequestList} from '../components';
import {getProfileData, getProfilePosts} from '../features/profile/profileThunk';
import {ProfileData, PostsList, PaginationBox} from '../components';
import {setPage} from '../features/profile/profileSlice';
import {GiHamburgerMenu} from 'react-icons/gi';
import {FaWindowClose} from 'react-icons/fa';

const Profile: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const [showFollowRequests, setShowFollowRequests] = React.useState(false);
    const toggleShowFollowRequests = () => {
        setShowFollowRequests(currentState => {
            return !currentState;
        });
    }
    const {logoutLoading} = useSelector((store: useSelectorType) => store.user);
    const {getProfileDataLoading, profileData, getProfilePostsLoading, posts, totalPosts, numberOfPages, page} = useSelector((store: useSelectorType) => store.profile);
    React.useEffect(() => {
        dispatch(getProfileData());
        dispatch(getProfilePosts());
    }, []);
    return (
        <Wrapper>
            {profileData!?.visibility === 'private' && (
                <div onClick={toggleShowFollowRequests} className="svg">{showFollowRequests ? <FaWindowClose className='close'/> : <GiHamburgerMenu/>}</div>
            )}
            {getProfileDataLoading ? (
                <Loading title="Loading Profile Data" position='normal'/>
            ) : (
                <div className="container">
                    {showFollowRequests && (
                        <div className="thirty">
                            <FollowRequestList/>
                        </div>
                    )}
                    <div className={`${showFollowRequests ? 'seventy' : 'hundred'}`}>
                        <ProfileData data={profileData!}/>
                    </div>
                </div>
            )}
            {getProfilePostsLoading ? (
                <Loading title="Loading Profile Posts" position='normal'/>
            ) : (
                <>
                    {posts.length ? (
                        <PostsList data={posts!} totalPosts={totalPosts!} hide={true}/>
                    ) : (
                        <div className="no-posts">No Posts...</div>
                    )}
                </>
            )}
            {numberOfPages! > 1 && (
                <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getProfilePosts}/>
            )}
            <button className="logout-btn" onClick={() => dispatch(logoutUser())}>{logoutLoading ? 'Logging Out...' : 'Logout'}</button>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 100%;
    .container {
        display: flex;
    }
    .hundred {
        width: 100%;
    }
    .thirty {
        width: 30%;
        border-top: 1px solid black;
        margin-right: 1rem;
        height: 22.5rem;
        overflow: auto;
        outline: 1px solid black;
    }
    .seventy {
        width: 70%;
    }
    .svg {
        cursor: pointer;
    }
    .close:hover {
        color: red;
    }
    .profile-header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0.25rem;
    }
    .no-posts {
        text-align: center;
        margin-bottom: 1rem;
        background-color: black;
        color: white;
        padding: 0.25rem;
    }
    .logout-btn {
        width: 100%;
        padding: 0.25rem;
    }
`;

export default Profile;