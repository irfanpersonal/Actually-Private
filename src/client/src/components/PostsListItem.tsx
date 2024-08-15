import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {toast} from 'react-toastify';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {PostType} from '../features/profile/profileSlice';
import {FaHeart, FaCommentDots} from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import {likePost, unlikePost} from '../features/post/postThunk';
import {setRedirectHome} from '../features/singlePost/singlePostSlice';
import {FaShareNodes, FaMessage, FaLocationDot} from "react-icons/fa6";
import {timeSince} from '../utils';
import {saveAs} from 'file-saver';

interface PostsListItemProps {
    data: PostType,
    hide: boolean
}

const PostsListItem: React.FunctionComponent<PostsListItemProps> = ({data, hide}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    return (
        <Wrapper>
            <div className="post-details">
 
                <div className="post-user-details">
                    <img onClick={() => navigate(`/user/${data!.user._id}`)} src={data!.user.profilePicture || emptyProfilePicture} className="post-user-profile-picture"/>
                    <div className="post-user-data" onClick={() => navigate(`/user/${data!.user._id}`)}>
                        <div className="nickName">{data.user!.nickName} <span className="name">@{data.user!.name}</span></div>
                        <div className="createdAt">{timeSince(new Date(data!.createdAt))}</div>
                    </div>
                </div>
          
                {/* {!hide && (
                    <div className="post-user-details">
                        <img onClick={() => navigate(`/user/${data!.user._id}`)} src={data!.user.profilePicture || emptyProfilePicture} className="post-user-profile-picture"/>
                        <div className="post-user-data">
                            <div className="nickName">{data.user!.nickName} <span className="name">@{data.user!.name}</span></div>
                            <div className="createdAt">{timeSince(new Date(data!.createdAt))}</div>
                        </div>
                    </div>
                )} */}
                <div className="post-content-container">
                    <div className="post-content">{data.content}</div>
                    <div className="attachmentWrapper">
                    {data.type === 'image' && (
                        <img src={data.attachmentUrl} className="post-image" alt={data.user!.name}/>
                    )}
                    {data.type === 'video' && (
                        <video src={data.attachmentUrl} controls></video>
                    )}
                    {data.type === 'audio' && (
                        <audio controls>
                            <source src={data.attachmentUrl}/>
                        </audio>
                    )}
                    {data.type === 'file' && (
                        <div onClick={async() => {
                            console.log(data.attachmentUrl);
                            try {
                                const fileBlob = await fetch(data.attachmentUrl).then((res) => res.blob());
                                saveAs(fileBlob, data.attachmentUrl.match(/post_(\w+\.\w+)$/)![1]);
                            } 
                            catch (error) {
                                console.error("Error downloading PDF:", error);
                            }
                        }} className="file"><span>📁</span>{data.attachmentUrl.match(/post_(\w+\.\w+)$/)![1]}</div>
                    )}
                    </div>

                    <div className="like-count-box">
                        <div className="like-count">
                            <FaHeart color={'white'} size={'0.5rem'}/>
                        </div>
                        <div className="like-count-label">{data.likes?.length}</div>
                        <div className="message-count">
                            <FaMessage color={'white'} size={'0.5rem'}/>
                        </div>
                        <div className="message-count-label">{data.comments?.length}</div>
                        {data.location && (
                            <>
                                <div className="location-info">
                                    <FaLocationDot color={'black'} size={'0.5rem'}/>
                                </div>
                                <div className="location-label">{data.location}</div>
                            </>
                        )}
                    </div>
                    {/* {hide && (
                        <div style={{paddingLeft: '1rem', color: 'white'}}>{timeSince(new Date(data!.createdAt))}</div>
                    )} */}
                    <div className="post-action-container">
                        <div className="post-action" onClick={() => {
                            if (data.liked) {
                                dispatch(unlikePost(data._id));
                                return;
                            }
                            dispatch(likePost(data._id));
                        }}>
                            <FaHeart className={`${data.liked ? 'liked' : 'unliked'}`} size={'1rem'}/>
                            <div className={`post-action-type`}>Like</div>
                        </div>
                        <div className="post-action" onClick={() => {
                            dispatch(setRedirectHome(false));
                            navigate(`/post/${data._id}`);
                        }}>
                            <FaCommentDots size={'1rem'}/>
                            <div className="post-action-type">Comment</div>
                        </div>
                        <div className="post-action" onClick={async() => {
                            if (navigator.clipboard) {
                                await navigator.clipboard.writeText(window.location.href);
                            }
                            toast.success('Copied Link!');
                        }}>
                            <FaShareNodes size={'1rem'}/>
                            <div className="post-action-type">Share</div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    padding: 10px;
    .post-details {
        overflow: hidden;
        border-radius: 12px;
        background-color: rgb(28, 39, 48);
        .post-user-details {
            cursor:pointer;
            display: flex;
	        flex-direction: row;
	        align-items: center;
	        padding:20px 20px 0px 20px;
            .post-user-profile-picture {
                width: 3.125rem;
	            height: 3.125rem;
	            object-fit: cover;
	            border-radius: 50%;
	            background-color: white;
            }
        }
        .post-user-data {
            display: flex;
	        flex-direction: column;
	        padding-left: 20px;
            .nickName {
                font-size: 14px;
                color: white;
            }
            .name {
                font-size: 12px;
                color: #6c7a87;
            }
            .createdAt {
                font-size: 12px;
                color: #6c7a87;    
                margin-top: 2px;
            }
        }
    }
    .post-content-container {
        display: flex;
	    flex-direction: column;
        padding-left:70px;
        .post-image {
            width: 100%;
            object-fit: cover;
        }
        .post-content {
            color: white;
            font-size: 14px;
            padding: 20px 20px;
        }
    }
    .like-count-box {
        display: flex;
	    flex-direction: row;
        padding: 20px;
	    align-items: center;
        .like-count {
            width: 1rem;
            height: 1rem;
            display: flex;
            margin-right: 0.5rem;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: red;
        }
        .like-count-label {
            color: white;
            font-size: 1rem;
        }
        .message-count {
            margin-left: 1rem;
            width: 1rem;
            height: 1rem;
            display: flex;
            margin-right: 0.5rem;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: #1c9be8;
        }
        .message-count-label {
            color: white;
            font-size: 1rem;
        }
        .location-info {
            margin-left: 1rem;
            width: 1rem;
            height: 1rem;
            display: flex;
            margin-right: 0.5rem;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: white;
        }
        .location-label {
            color: white;
            font-size: 1rem;
        }
    }
    .post-action-container {
        gap:20px;
        display: flex;
        padding: 20px;
        padding-top:0px;
        flex-direction: row;
        .post-action {
            flex: 1;
            cursor: pointer;
            user-select: none;
            color: white;
            display: flex;
            padding: 15px 10px;
            font-size: 14px;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background-color: rgb(39, 52, 62);
            &:hover {
                outline: 1px solid white;
            }
            .post-action-type {
                font-size: 14px;
                margin-left: 12px;
            }
        }
    }
    .attachmentWrapper {
        display:flex;
        padding:0px 20px;
        img {
            height:280px;
            object-fit:cover;
            border-radius:12px;
        }
        video {
            width:100%;
            overflow:hidden;
            border-radius:12px;
        }
        audio {
            width: 100%; 
            opacity: 0.3;
            margin: 0 auto; 
            filter: invert(1);
            background: #f2f3f4; 
            border-radius: 12px; 
        }
        .file {
            cursor:pointer;
            font-size:14px;
            color:#6c7a87;
            padding:10px 15px;
            border-radius:8px;
            background-color:#171f25;
            text-transform:capitalize;
            span {
                margin-right:10px;
                margin-bottom:-2px;
            }
        }
    }
    .unliked {
        color: white;
    }
    .liked {
        color: red;
    }
`;

export default PostsListItem;