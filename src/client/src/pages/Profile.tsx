import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, FollowRequestList, UserBox, TrendingBox} from '../components';
import {getProfileData, getProfilePosts} from '../features/profile/profileThunk';
import {ProfileData, PostsList, PaginationBox} from '../components';
import {setPage} from '../features/profile/profileSlice';
import {GiHamburgerMenu} from 'react-icons/gi';
import {FaWindowClose} from 'react-icons/fa';
import { IoClose } from "react-icons/io5";

const Profile: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const [showFollowRequests, setShowFollowRequests] = React.useState(false);
    const toggleShowFollowRequests = () => {
        setShowFollowRequests(currentState => {
            return !currentState;
        });
    }
    const {getProfileDataLoading, profileData, getProfilePostsLoading, posts, totalPosts, numberOfPages, page} = useSelector((store: useSelectorType) => store.profile);
    React.useEffect(() => {
        dispatch(getProfileData());
        dispatch(getProfilePosts());
    }, []);
    return (
        <Wrapper>
            <div className="container">
             
                <UserBox/>
                <div className="half">
                {profileData!?.visibility === 'private' && <div onClick={toggleShowFollowRequests} className="viewFollowerRequestsBox"><div className="cBlue f14">View Follower Requests</div></div>}
                {getProfileDataLoading ? (
                    <Loading title="Loading Profile Data" position='normal'/>
                ) : (
                    <div className="profileItemUnit">
                        {showFollowRequests && (
                            <div className="myModal">
                                <div className="modalContainer">

                                    <div className="modalHeader">
                                        <h1>Follower Requests</h1>
                                        <IoClose onClick={() => setShowFollowRequests(currentState => !currentState)}/>
                                    </div>
                                    <FollowRequestList/>
                                </div>
                            </div>
                        )}
                        <div className={`${showFollowRequests ? 'hundred' : 'hundred'}`}>
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
                            <div className=""></div>
                        )}
                    </>
                )}
                {numberOfPages! > 1 && (
                    <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getProfilePosts}/>
                )}
                </div>
                <TrendingBox/>
            </div>
            
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .container {
        display: flex;
        .containerDelegate {
            display:flex;
            flex-direction:row;
        }
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
    .profileUnit {
        display:none;
    }
    .editProfile:hover , .submitEdit:hover {
        opacity:0.7;
    }
    .viewFollowerRequestsBox {
        margin:10px;
        padding:15px;
        border-radius:12px;
        background-color:#1c2730;
        cursor:pointer;
    }
    .viewFollowerRequestsBox:hover div {
        opacity: 0.7;
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
            .userGraphics {
                display:flex;
                padding:10px;
                margin-bottom:20px;
                border-radius:12px;
                position: relative;
                background-color:#1c2730;
                .ugProfilePhoto {
                    display:flex;
                    width:120px;
                    height:120px;
                    padding:10px;
                    position:relative;
                    img {
                        width:100%;
                        height:100%;
                        margin:0px;
                        object-fit:cover;
                        border-radius:12px;
                    }
                }
                .ugCoverPhoto {
                    flex:1;
                    display:flex;
                    height:150px;
                    padding:10px;
                    position:relative;
                    img {
                        width:100%;
                        height:100%;
                        margin:0px;
                        object-fit:cover;
                        border-radius:12px;
                    }
                }
                #profile-image {
                    display:none;
                }
                .piLabel {
                    top:0px;
                    bottom:0px;
                    left:0px;
                    right:0px;
                    margin:auto;
                    width:80px;
                    height:30px;
                    display:flex;
                    cursor:pointer;
                    font-size:14px;
                    color:#1c9be8;
                    padding:10px 10px;
                    position:absolute;
                    border-radius:8px;
                    align-items: center;
                    justify-content: center;
                    background-color:#FFFFFF;
                    box-shadow:0px 3px 6px rgba(0,0,0,0.20);
                }
            }
            .udCombo {
                display:flex;
                flex-direction:row;
            }
            .userDetailItem {
                flex:1;
                display:flex;
                padding:10px 10px;
                flex-direction:column;
            }
            .userDetailItem label {
                font-size:12px;
                color:#6c7a87;
                margin-top:0px;
                margin-bottom:5px;
            }
            .userDetailItem input , select {
                flex:1;
                width:100%;
                min-height:48px;
                display:flex;
                font-size:14px;
                color:#FFFFFF;
                padding:0px 15px;
                border-width:0px;
                border-radius:12px;
                background-color:rgb(39, 52, 62);
            }
            .userDetailItem textarea {
                flex:1;
                width:100%;
                min-height:80px;
                display:flex;
                font-size:14px;
                color:#FFFFFF;
                padding:15px 15px 0px 15px;
                border-width:0px;
                border-radius:12px;
                background-color:rgb(39, 52, 62);
            }
        }
    }
    @media (max-width:768px) {
        .myModal {
            bottom:78px;
        }
        .myModal .modalContainer {
            margin-left:20px;
            margin-right:20px;
        }
    }
`;

export default Profile;