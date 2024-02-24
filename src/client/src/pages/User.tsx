import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {MdBlock} from "react-icons/md";
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {useNavigate, useParams} from 'react-router-dom';
import {getSingleUser, followUser, unfollowUser, createFollowRequest, deleteFollowRequest, blockUser, unblockUser, getSingleUserPosts} from '../features/singleUser/singleUserThunk';
import {setPage} from '../features/singleUser/singleUserSlice';
import {Loading, PostsList, PaginationBox} from '../components';
import {FaWindowClose} from 'react-icons/fa';

const User: React.FunctionComponent = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const [showBlockModal, setShowBlockModal] = React.useState(false);
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {singleUserLoading, singleUser, isFollowing, followUserLoading, unfollowUserLoading, sentFollowRequest, createFollowRequestLoading, deleteFollowRequestLoading, blockUserLoading, unblockUserLoading, isBlockedByYou, msg, getSingleUserPostsLoading, numberOfPages, totalPosts, singleUserPosts, page, canViewPosts, didUserBlockMe} = useSelector((store: useSelectorType) => store.singleUser);
    React.useEffect(() => {
        if (id === user!?.userID) {
            navigate('/profile');
        }
        dispatch(getSingleUser(id!));
        dispatch(getSingleUserPosts(id!));
    }, []);
    return (
        <Wrapper>
            {singleUserLoading ? (
                <Loading title='Loading Single User' position='normal' marginTop='1rem'/>
            ) : (
                <>  
                    {!isBlockedByYou && (
                        <div onClick={() => {
                            setShowBlockModal(currentState => {
                                return !currentState;
                            });
                        }} className="icon"><MdBlock/></div>
                    )}
                    {showBlockModal && (
                        <div id="modal-root">
                            <div className="modal-overlay">
                                <div className="modal-container">
                                    <div className="modal-header">
                                        <div>Block User</div>
                                        <div onClick={() => setShowBlockModal(currentState => !currentState)} className="icon"><FaWindowClose/></div>
                                    </div>
                                    <div className="modal-content">
                                        <p>Are you sure you want to block this user?</p>
                                        <div onClick={() => {
                                            if (blockUserLoading) {
                                                return;
                                            }
                                            dispatch(blockUser(id!));
                                        }} className="block-btn">{blockUserLoading ? 'Blocking' : 'Block'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>                      
                    )}
                    {singleUser && (
                        <div className="profile-container">
                            <img className="profile-image" src={singleUser!.profilePicture || emptyProfilePicture}/>
                            <div>{singleUser!.name}</div>
                            <div>{singleUser!.bio ? singleUser!.bio : 'No Bio Provided'}</div>
                            <div>{singleUser!.location ? singleUser!.location : 'No Location Provided'}</div>
                            <div>{singleUser!.dateOfBirth ? moment(singleUser!.dateOfBirth).utc().format('YYYY-MM-DD') : 'No Date of Birth Provided'}</div>
                            <div>Visibility: {singleUser!.visibility.toUpperCase()}</div>
                            {singleUser!.visibility === 'private' && !isFollowing && !didUserBlockMe ? (
                                <>
                                    {!isBlockedByYou && (
                                        <div onClick={() => {
                                            if (createFollowRequestLoading || deleteFollowRequestLoading) {
                                                return;
                                            }
                                            if (sentFollowRequest) {
                                                dispatch(deleteFollowRequest(id!));
                                                return;
                                            }
                                            dispatch(createFollowRequest(id!));
                                        }} className="btn">{sentFollowRequest ? 'Cancel Follow Request' : 'Send Follow Request'}</div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {(!isBlockedByYou && !didUserBlockMe) && (
                                        <div onClick={() => {
                                            if (followUserLoading || unfollowUserLoading) {
                                                return;
                                            }
                                            if (isFollowing) {
                                                dispatch(unfollowUser(id!));
                                                return;
                                            }
                                            dispatch(followUser(id!));
                                        }} className="btn">{isFollowing ? <span>{unfollowUserLoading ? 'Unfollowing' : 'Unfollow'}</span> : <span>{followUserLoading ? 'Following' : 'Follow'}</span>}</div>
                                    )}
                                </>
                            )}
                            <div className="connection-container">
                                <div className="connection-box">
                                    <div className="connection-box-title">Following</div>
                                    <div>{singleUser!.following.length}</div>
                                </div>
                                <div className="connection-box">
                                    <div className="connection-box-title">Followers</div>
                                    <div>{singleUser!.followers.length}</div>
                                </div>
                            </div>  
                        </div> 
                    )}
                    {canViewPosts ? (
                        <>
                            {getSingleUserPostsLoading ? (
                                <Loading title="Loading Single User Posts" position='normal' marginTop='1rem'/>
                            ) : (
                                <>
                                    {singleUserPosts.length ? (
                                        <PostsList data={singleUserPosts!} totalPosts={totalPosts!} hide={true}/>
                                    ) : (
                                        <div className="no-posts">No Posts</div>
                                    )}
                                    {numberOfPages! > 1 && (
                                        <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getSingleUserPosts} _id={id!}/>
                                    )}
                                </>
                            )} 
                        </>
                    ) : (
                        <>
                            {singleUser!.visibility === 'private' && (
                                <div style={{textAlign: 'center', marginBottom: '1rem'}}>You must be following this user to view posts!</div>
                            )}
                        </>
                    )}
                </>
            )}
            {(isBlockedByYou) && (
                <>
                    <div className="title">
                        <div>{isBlockedByYou ? 'You blocked this user' : 'This user has blocked you'}</div>
                        <div onClick={() => {
                            if (unblockUserLoading) {
                                return;
                            }
                            dispatch(unblockUser(id!));
                        }} className="btn unblock-btn">{unblockUserLoading ? 'Unblocking' : 'Unblock'}</div>
                    </div>
                </>
            )}
            {didUserBlockMe && (
                <div className="title">{singleUser!.name} blocked you.</div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .icon {
        cursor: pointer;
    }
    #modal-root {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px); 
        .modal-overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .modal-container {
                outline: 1px solid black;
                width: 50%;
                padding: 1rem;
                background-color: white;
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid black;
                }
                .modal-content {
                    text-align: center;
                    margin-top: 1rem;
                    .block-btn {
                        background-color: red;
                        cursor: pointer;
                        color: white;
                        border-radius: 1rem;
                        text-align: center;
                        margin-top: 1rem;
                        padding: 0.5rem;
                    }
                    .block-btn:hover, .block-btn:active {
                        outline: 1px solid black;
                    }
                }
            }
        }
    }
    .user-info {
        border: 1px solid black;
        .user-image {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
            outline: 1px solid black;
        }
    }
    .profile-container {
        background-color: lightgray;
        outline: 1px solid black;
        text-align: center;
        padding: 1rem;
        margin-bottom: 1rem;
        .profile-image {
            width: 5rem;
            height: 5rem;
            outline: 1px solid black;
        }
        .connection-container {
            margin-top: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .connection-box {
                cursor: pointer;
                user-select: none;
                .connection-box-title {
                    border-bottom: 1px solid black;
                }
                outline: 1px solid black;
                padding: 0.5rem;
                margin-right: 0.5rem;
            }
        }
        .edit-btn {
            width: 25%;
            margin-top: 1rem;
            padding: 0.25rem;
            user-select: none;
        }
        .btn {
            display: inline-block;
            background-color: gray;
            cursor: pointer;
            padding: 0.25rem 1rem;
            outline: 1px solid black;
            margin: 0.25rem auto;
        }
    }
    .title {
        text-align: center;
        outline: 1px solid black;
        padding: 1rem;
    }
    .unblock-btn {
        cursor: pointer;
        background-color: red;
        border-radius: 1rem;
        color: white;
        padding: 0.25rem;
        margin-top: 0.25rem;
    }
    .unblock-btn:hover, .unblock-btn:active {
        outline: 1px solid black;
    }
    .no-posts {
        text-align: center;
        background-color: black;
        color: white;
        padding: 0.25rem;
    }
`;

export default User;