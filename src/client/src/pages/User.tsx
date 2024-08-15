import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {useNavigate, useParams} from 'react-router-dom';
import {getSingleUser, followUser, unfollowUser, createFollowRequest, deleteFollowRequest, blockUser, unblockUser, getSingleUserPosts} from '../features/singleUser/singleUserThunk';
import {setPage} from '../features/singleUser/singleUserSlice';
import {Loading, PostsList, PaginationBox, UserBox, TrendingBox} from '../components';
import {IoClose} from "react-icons/io5";

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
    }, [id]);
    return (
        <Wrapper>
            <div className="container">
                <UserBox/>
                <div className="half">
                {singleUserLoading ? (
                    <Loading title='Loading Single User' position='normal' marginTop='1rem'/>
                ) : (
                    <>  
                        {singleUser && (
                            <div className="profile-container">
                                <div className="profileHeader">
                                    <div className="inner">
                                        <img className="coverBanner" src={singleUser!.profilePicture || emptyProfilePicture}/>
                                    </div>
                                </div>

                                <div className="profileBody">
                                    <div className="inner">
                                        <div className="profileBodyBox">
                                            <img className="profile-image" src={singleUser!.profilePicture || emptyProfilePicture}/>
                                            <div className="profileBodyMetaRow">
                                                <div className="profileBodyMeta">
                                                    <div className="cWhite f14">{singleUser!.nickName}</div>
                                                    <div className="cGray f14">@{singleUser!.name}</div>
                                                </div>

                                                <div className="userActionRow">
                                                    {!isBlockedByYou && (
                                                        <div onClick={() => {
                                                            setShowBlockModal(currentState => {
                                                                return !currentState;
                                                            });
                                                        }} className="icon">
                                                            {/* <MdBlock/> */}
                                                            Block
                                                        </div>
                                                    )}
                                                    {showBlockModal && (
                                                        <div className="myModal">
                                                            <div className="modalContainer">
                                                                <div className="modalHeader">
                                                                    <h1>Block User</h1>
                                                                    <IoClose onClick={() => setShowBlockModal(currentState => !currentState)}/>
                                                                </div>
                                                                <div className="userDetailList">
                                                                    <div className="modal-content">
                                                                        <p className="pad10 f14 cGray">Are you sure you want to block this user?</p>
                                                                    </div>
                                                                </div>
                                                                <div className="userDetailAction">
                                                                    <div onClick={() => {
                                                                        if (blockUserLoading) {
                                                                            return;
                                                                        }
                                                                        dispatch(blockUser(id!));
                                                                        setShowBlockModal(currentState => !currentState);
                                                                    }} className="block-btn">{blockUserLoading ? 'Blocking' : 'Block'}</div>
                                                                </div>
                                                                
                                                            </div>
                                                        </div>                      
                                                    )}
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
                                                                }} className="blueButton">{sentFollowRequest ? 'Cancel Follow Request' : 'Send Follow Request'}</div>
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
                                                                }} className="blueButton">{isFollowing ? <span>{unfollowUserLoading ? 'Unfollowing' : 'Unfollow'}</span> : <span>{followUserLoading ? 'Following' : 'Follow'}</span>}</div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="profileFollowers">
                                                <div className="followersItem">
                                                    <span>{singleUser!.following.length}&nbsp;</span>
                                                    <div>Following</div>
                                                </div>
                                                <div className="followersItem">
                                                    <span>{singleUser!.followers.length}&nbsp;</span>
                                                    <div>Followers</div>
                                                </div>
                                            </div>

                                            <div className="ProfileBodyAdditional">
                                                <div className="cWhite f14">{singleUser!.bio ? singleUser!.bio : 'No Bio Provided'}</div>
                                                {/* <div className="cGray f14">{data!.location ? data!.location : 'No Location Provided'}</div> */}
                                            </div>

                                            {/* <div>{data!.dateOfBirth ? moment(data!.dateOfBirth).utc().format('YYYY-MM-DD') : 'No Date of Birth Provided'}</div>
                                            <div>Visibility: {data!.visibility.toUpperCase()}</div> */}
                                
                                        </div>
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
                                            <div className=""></div>
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
                                    <div className="privateUserLabel">You must be following this user to view posts!</div>
                                )}
                            </>
                        )}
                    </>
                )}
                {(isBlockedByYou) && (
                    <>
                        <div className="unblockUnit">
                            <span>{isBlockedByYou ? 'You blocked this user' : 'This user has blocked you'}</span>
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
                </div>
                <TrendingBox/>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .icon {
        cursor: pointer;
    }
    .myModal {
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        z-index:999;
        position:fixed;
        display:flex;
        align-items: center;
        justify-content: center;
        background-color:rgba(0,0,0,0.9);
        overflow-y:auto;
        .modalContainer {
            width:600px;
            margin:auto;
            padding:20px;
            border-radius:12px;
            background-color:#06141d;
            .modalHeader {
                display:flex;
                flex-direction:row;
                align-items: center;
                justify-content: space-between;
                padding-bottom:20px;
                color:#FFFFFF;
                h1 {
                    font-weight:500;
                }
                svg {
                    font-size:24px;
                    cursor:pointer;
                }
            }
            .userDetailList {
                padding:10px;
                border-radius:12px;
                background-color:#1c2730;
            }
            .userDetailAction {
                display:flex;
            }
            .block-btn {
                margin: 0px;
                width: initial;
                color: #FFFFFF;
                border-width: 0px;
                font-size: 14px;
                padding: 15px 60px;
                border-radius: 12px;
                margin-top: 20px;
                cursor: pointer;
                background-color: #FF0000;
            }
        }
    }
    @media (max-width:768px) {
        .modalContainer {
            margin-left:20px;
            margin-right:20px;
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
    .profile-container {
        .profile-image {
            width: 100px;
            height: 100px;
            border-radius: 12px;
            border: 4px solid #ffffff;
            margin-top: -50px;
            margin-left: 20px;
            object-fit: cover;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.50);
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
    }
    .profileBodyBox {
        background-color:#1c2730;
        .profileBodyWrapper {
            position:relative;
        }
        .profileBodyMetaRow {
            display:flex;
            flex-direction:row;
            align-items:flex-start;
            justify-content: space-between;
            padding:0px 20px 20px 20px;
        }
        .userActionRow {
            display:flex;
            flex-direction:row;
            gap:10px;
            .icon {
                cursor:pointer;
                font-size:12px;
                color:#FF0000;
                padding:4px 15px;
                border-radius:6px;
                background-color:#FFFFFF;
                border:0px solid #1c9be8;
            }
        }
        .userActionRow .icon:hover , .userActionRow .blueButton:hover , .block-btn:hover , .modalHeader svg:hover {
            opacity:0.7;
        }
        .blueButton {
            cursor:pointer;
            font-size:12px;
            color:#1c9be8;
            padding:4px 15px;
            border-radius:6px;
            background-color:#FFFFFF;
            border:0px solid #1c9be8;
        }
        .ProfileBodyAdditional {
            padding:0px 20px 20px 20px;
        }
    }
    .profileHeader .inner {
        display:flex;
        padding-bottom:0px;
        .coverBanner {
            width:100%;
            height:200px;
            border-radius:12px 12px 0px 0px;
            background-color:#eeeeee;
            object-fit:cover;
        }
    }
    .profileBody .inner {
        padding-top:0px;
        .profileBodyBox {
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
        }
    }
    .profileFollowers {
        display:flex;
        flex-direction:row;
        margin-top:-5px;
        margin-bottom:15px;
        padding:0px 20px;
        .followersItem {
            margin-right:20px;
            span {
                font-size:14px;
                color:#FFFFFF;
            }
            div {
                font-size:14px;
                color:#6c7a87;
            }
        }
    }
    .profileUnit {
        display:none;
    }
    .unblockUnit {
        padding:20px;
        margin:10px;
        border-radius:12px;
        background-color:#1c2730;
        span {
            font-size:14px;
            color:#6c7a87;
        }
        div.btn.unblock-btn {
            padding:10px;
            font-size:14px;
            margin-top:10px;
            text-align:center;
            border-radius:12px;
        }
    }
    .privateUserLabel {
        margin:10px;
        padding:15px;
        font-size:14px;
        color:#FFFFFF;
        border-radius:12px;
        background-color:#1c2730;
    }
`;

export default User;