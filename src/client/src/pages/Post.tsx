import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import emptyPostPicture from '../images/empty-post-image.jpeg';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, CommentList, PaginationBox, UserBox, TrendingBox, ProfileData} from '../components';
import {FaTrash, FaArrowAltCircleLeft, FaHeart, FaArrowRight} from "react-icons/fa";
import {FiCopy} from "react-icons/fi";
import {MdAutoDelete} from "react-icons/md";
import {deleteSinglePost, getSinglePost, getSinglePostComments, likeSinglePost, unlikeSinglePost} from '../features/singlePost/singlePostThunk';
import {createComment} from '../features/post/postThunk';
import {setPage} from '../features/singlePost/singlePostSlice';
import {FaCommentDots, FaLocationDot, FaMessage, FaShareNodes} from 'react-icons/fa6';
import {saveAs} from 'file-saver';
import {timeSince} from '../utils';
import {getProfileData} from '../features/profile/profileThunk';

const Post: React.FunctionComponent = () => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = React.useState(false);
    const toggleShowMessage = () => {
        setShowMessage(currentState => {
            return !currentState;
        });
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('content', (target.elements.namedItem('content') as HTMLTextAreaElement).value);
        dispatch(createComment({id: id!, data: formData}));
        toggleShowMessage();
    }
    const {getSinglePostLoading, singlePost, getSinglePostCommentsLoading, comments, totalComments, numberOfPages, redirectHome, yourPost, deleteSinglePostLoading, liked, page} = useSelector((store: useSelectorType) => store.singlePost);
    const {creatingComment} = useSelector((store: useSelectorType) => store.post);
    React.useEffect(() => {
        if (redirectHome) {
            navigate('/');
            return;
        }
        dispatch(getSinglePost(id!));
        dispatch(getSinglePostComments(id!));
    }, [redirectHome]);

    const {profileData} = useSelector((store: useSelectorType) => store.profile);
    React.useEffect(() => {
        dispatch(getProfileData());
    }, []);

    return (
        <Wrapper>
            <div className="container">
                <UserBox/>
                <div className="half">
                {getSinglePostLoading ? (
                    <Loading title='Loading Single Post' position='normal' marginTop='1rem'/>
                ) : (
                    <>
                        <div className="singlePost">
                            <div className="post-details">
                                <div className="post-user-details">
                                    <img onClick={() => navigate(`/user/${singlePost!.user._id}`)} src={singlePost!.user.profilePicture || emptyProfilePicture} className="post-user-profile-picture"/>
                                    <div className="post-user-data">
                                        <div className="nickName">{singlePost!.user.nickName} <span className="name">@{singlePost!.user!.name}</span></div>
                                        <div className="createdAt">{timeSince(new Date(singlePost!.createdAt))}</div>
                                    </div>
                                </div>

                                <div className="post-content-container">
                                    <div className="post-content">{singlePost!.content}</div>
                                    <div className="attachmentWrapper">
                                        {singlePost!.type === 'image' && (
                                            <img src={singlePost!.attachmentUrl || emptyPostPicture} className="post-image" alt={singlePost!.user!.name}/>
                                        )}
                                        {singlePost!.type === 'video' && (
                                            <video src={singlePost!.attachmentUrl} controls></video>
                                        )}
                                        {singlePost!.type === 'audio' && (
                                            <audio controls>
                                                <source src={singlePost!.attachmentUrl}/>
                                            </audio>
                                        )}
                                        {singlePost!.type === 'file' && (
                                            <div onClick={async() => {
                                                try {
                                                    const fileBlob = await fetch(singlePost!.attachmentUrl).then((res) => res.blob());
                                                    saveAs(fileBlob, singlePost!.attachmentUrl.match(/post_(\w+\.\w+)$/)![1]);
                                                } 
                                                catch (error) {
                                                    console.error("Error downloading PDF:", error);
                                                }
                                            }} className="file">📁 {singlePost!.attachmentUrl.match(/post_(\w+\.\w+)$/)![1]}</div>
                                        )}
                                    </div>
                                    <div className="like-count-box">
                                        <div className="like-count">
                                            <FaHeart color={'white'} size={'0.5rem'}/>
                                        </div>
                                        <div className="like-count-label">{singlePost!.likes?.length}</div>
                                        <div className="message-count">
                                            <FaMessage color={'white'} size={'0.5rem'}/>
                                        </div>
                                        <div className="message-count-label">{singlePost!.comments?.length}</div>
                                        {singlePost!.location && (
                                            <>
                                                <div className="location-info">
                                                    <FaLocationDot color={'black'} size={'0.5rem'}/>
                                                </div>
                                                <div className="location-label">{singlePost!.location}</div>
                                            </>
                                        )}
                                    </div>
                                    <div className="post-action-container">
                                        <div className="post-action" onClick={() => {
                                            if (liked) {
                                                dispatch(unlikeSinglePost(id!));
                                                return;
                                            }
                                            dispatch(likeSinglePost(id!));
                                        }}>
                                            <FaHeart className={`${liked ? 'liked' : 'unliked'}`} size={'1rem'}/>
                                            <div className={`post-action-type`}>Like</div>
                                        </div>
                                        <div className="post-action" onClick={() => {
                                            toggleShowMessage();
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
                                        {yourPost && (
                                            <>
                                                <div className="deletePost" onClick={() => {
                                                    if (deleteSinglePostLoading) {
                                                        return;
                                                    }
                                                    dispatch(deleteSinglePost(id!));
                                                }}>{deleteSinglePostLoading ? <MdAutoDelete/> : <FaTrash/>}</div>
                                            </>
                                        )}

                                    </div>
                                </div>
  
                            </div>
                        </div>
                    </>
                )}

                {showMessage && (
                    <form className="commentBox" onSubmit={handleSubmit}>
                        <div className="form-input">
                            <div className="namePerson"></div>
                            <img src={profileData!.profilePicture || emptyProfilePicture}/>
                            <textarea placeholder="Begin typing" name="content" required></textarea>
                            <button type="submit" className="send" disabled={creatingComment}>{creatingComment ? <div className="loading"></div> : 'Post'}</button>
                        </div>
                    </form>
                )}

                {getSinglePostCommentsLoading ? (
                    <Loading title='Loading Single Post Comments' position='normal' marginTop='1rem'/>
                ) : (
                    <>
                        <CommentList data={comments} totalComments={totalComments!}/>
                        {numberOfPages! > 1 && (
                            <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getSinglePostComments} _id={id!}/>
                        )}
                    </>
                )}
                </div>
                <TrendingBox/>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .singlePost {
        padding:10px;
    }
    .post-details {
        overflow: hidden;
        border-radius: 12px;
        background-color: rgb(28, 39, 48);
        .post-user-details {
            display: flex;
	        flex-direction: row;
	        align-items: center;
	        padding:20px 20px 0px 20px;
            color:initial;
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
    @media (max-width:768px) {
        .post-content-container {
            padding-left:0px;
        }
    }
    @media (max-width:480px) {
        .post-content-container .post-action-container {
            gap:10px;
        }
        .post-details .post-action-container .post-action .post-action-type {
            font-size:12px;
        }
    }

    .post-navigation {
        padding: 1rem;
        background-color: black;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .edit, .trash, .copy {
        cursor: pointer;
    }
    .edit:hover, .edit:active {
        color: gray;
    }
    .trash:hover, .trash:active {
        color: lightcoral;
    }
    .copy:hover, .copy:active {
        color: lightblue;
    }
    .post-user-actions {
        display: flex;
        div {
            margin-left: 1rem;
        }
    }
    .post-info {
        overflow: hidden;
        border-radius: 1rem;
        background-color: rgb(28, 39, 48);
        .post-user-details {
            display: flex;
	        flex-direction: row;
	        align-items: center;
	        padding: 1.25rem;
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
	        padding-left: 1rem;
            .nickName {
                font-size: 1rem;
                color: white;
            }
            .name {
                font-size: 0.85rem;
                color: gray;
            }
            .createdAt {
                font-size: 0.85rem;
                color: gray;    
                margin-top: 0.25rem;
            }
        }
        .post-image {
            width: 100%;
            object-fit: contain;
        }
        .post-content {
            padding: 0px 20px 10px 20px;
            font-size:14px;
            color: white;
            margin: 1rem 0;
        }
        audio {
            width: 95%;
            margin: 0 auto;
        }
        .file {
            display: inline;
            margin-left: 1.25rem;
            color: white;
            cursor: pointer;
            span {
                margin-right: 0.5rem;
            }
            button {
                padding: 0.5rem 1rem;
            }
            &:hover {
                text-decoration: underline;
            }
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
    .post-content-details {
        padding: 1rem;
        .post-content-name {
            cursor: pointer;
            text-decoration: underline;
        }
    }
    .post-actions {
        display: flex;
        .icon {
            cursor: pointer;
            margin-right: 1rem;
        }
    }
    .unliked {
        color: white;
    }
    .liked {
        color: red;
    }
    .loading {
        border: 0.25rem solid white;
        border-top: 0.25rem solid black;
        border-radius: 50%;
        width: 1rem;
        height: 1rem;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { 
            transform: rotate(0deg); 
        }
        100% { 
            transform: rotate(360deg); 
        }
    }
    .small-image {
        width: 5rem;
        height: 5rem;
        outline: 1px solid black;
    }
    .edit-post-form {
        p {
            text-align: center;
            margin-top: 0.5rem;
        }
        img {
            display: block;
            margin: 0 auto;
            margin-top: 0.5rem;
        }
        label {
            display: block;
            text-align: center;
            margin-top: 0.5rem;
        }
        input {
            display: block;
            margin: 0 auto;
            outline: 1px solid black;
            margin-top: 0.5rem;
            margin-bottom: 1rem;
            padding: 0.5rem
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
    .deletePost {
        width:51px;
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
        border:1px solid rgb(39, 52, 62);
    }
    .commentBox {
        padding:10px;
        margin-top:0px;
        .form-input {
            display:flex;
            padding:20px;
            border-radius:12px;
            background-color:rgb(28, 39, 48);
            img {
                width:3.125rem;
                height:3.125rem;
                object-fit:cover;
                border-radius:999px;
            }
            textarea {
                flex:1;
                display:flex;
                margin-left:20px;
                outline: none;
                height: 75px;
                resize: none;
                display: flex;
                flex-direction: column;
                font-size: 14px;
                border-width: 0;
                border-radius: 12px;
                background-color: rgb(39, 52, 62);
                padding: 15px 40px 0px 15px;
                color: white;
                overflow: hidden;
            }
            textarea::placeholder {
                color: #6c7a87;
                opacity: 1; 
            }
            .send {
                width: 40px;
                height: 40px;
                font-size: 10px;
                color: #FFFFFF;
                display: flex;
                margin-left:20px;
                border-radius: 12px;
                align-items: center;
                justify-content: center;
                background-color: #1c9be8;
                border-width: 0px;
            }
        }
    }
`;

export default Post;