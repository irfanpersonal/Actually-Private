import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {type CommentType} from '../features/singlePost/singlePostSlice';
import {FaHeart, FaTrash, FaRegEdit} from 'react-icons/fa';
import {useDispatch, useSelector} from 'react-redux';
import {useDispatchType, useSelectorType} from '../store';
import {useParams, Link} from 'react-router-dom';
import {timeSince} from '../utils';
import { IoClose } from "react-icons/io5";
import {deleteSinglePostComment, editSinglePostComment, likeSinglePostComment, unlikeSinglePostComment} from '../features/singlePost/singlePostThunk';

interface CommentListItemProps {
    data: CommentType
}

const CommentListItem: React.FunctionComponent<CommentListItemProps> = ({data}) => {
    const {id: postID} = useParams();
    const {deleteSinglePostCommentLoading} = useSelector((store: useSelectorType) => store.singlePost);
    const [isEditing, setIsEditing] = React.useState(false);
    const toggleIsEditing = () => {
        setIsEditing(currentState => {
            return !currentState;
        });
    }
    const dispatch = useDispatch<useDispatchType>();
    return (
        <Wrapper>
            <div className="commentItem">

                <div className="post-details">
                    <div className="post-user-details">
                        <Link onClick={() => {}} to={`/user/${data.user._id}`} className="userHeadLeftUnit">
                            <img src={data!.user.profilePicture || emptyProfilePicture} className="post-user-profile-picture"/>
                            <div className="post-user-data">
                                <div className="nickName">{data!.user.nickName} <span className="name">@{data!.user!.name}</span></div>
                                <div className="createdAt">{timeSince(new Date(data!.createdAt))}</div>
                            </div>
                        </Link>
                        <div className="rightAction">
                            {data.myComment && (
                                <>
                                        <div onClick={toggleIsEditing} className="deletePost">{isEditing ? <IoClose color={'#6c7a87'} size={'18px'} /> : <FaRegEdit color={'#6c7a87'} size={'12px'}/>}</div>
                                        <div className="deletePost" onClick={() => {
                                            if (deleteSinglePostCommentLoading) {
                                                return;
                                            }
                                            dispatch(deleteSinglePostComment({postID: postID!, commentID: data._id}));
                                        }}><FaTrash color={'#6c7a87'} size={'12px'}/></div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                            
                <div className="post-content-container">
                    <div className="commentContext">
                        {isEditing ? (
                            <>
                                <textarea id="content" name="content" defaultValue={data.content} required></textarea>
                                <div className="confirmEdit" onClick={() => {
                                    const formData = new FormData();
                                    formData.append('content', (document.querySelector('#content') as HTMLTextAreaElement).value);
                                    dispatch(editSinglePostComment({postID: postID!, commentID: data._id, data: formData}));
                                }}>Edit</div>
                            </>
                        ) : (
                            <div>{data.content}</div>
                        )}
                        
                    </div>
                    <div className="likeBoxItem">
                        <div onClick={() => {
                            if (data.liked) {
                                dispatch(unlikeSinglePostComment({postID: postID!, commentID: data._id}));
                                return;
                            }
                            dispatch(likeSinglePostComment({postID: postID!, commentID: data._id}));
                        }} className={`icon ${data.liked ? 'liked' : 'unliked'}`}><FaHeart/> <span>{data.likes.length}</span></div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    padding:10px;
    .userHeadLeftUnit {
        display:flex;
        align-items:center;
        color:initial;
        text-decoration:none;
    }
    .commentItem {
        border-radius: 12px;
        background-color: rgb(28, 39, 48);
    }
    .commentContext {
        padding:20px;
        font-size:14px;
        color:#FFFFFF;
        display:flex;
        flex-direction:row;
        textarea {
            flex: 1;
            display: flex;
            outline: none;
            height: 80px;
            resize: none;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            border-width: 0;
            border-radius: 12px;
            background-color: rgb(39, 52, 62);
            padding: 15px;
            color: white;
            overflow: hidden;
        }
        .confirmEdit {
            width: 40px;
            height: 40px;
            font-size: 10px;
            color: #FFFFFF;
            display: flex;
            margin-left: 20px;
            border-radius: 12px;
            align-items: center;
            justify-content: center;
            background-color: #1c9be8;
            border-width: 0px;
        }
    }
    .likeBoxItem {
        padding:0px 20px 20px 20px;
    }
    .rightAction {
        gap:20px;
        display:flex;
        flex-direction:row;
        margin-left:auto;
        margin-bottom:auto;
        .deletePost {
            padding:0px;
            width:initial;
            height:initial;
            border-width:0px;
            svg {
                font-size:14px;
            }
        }
    }
    .likeBoxItem {
        display:flex;
        div {
            cursor: pointer;
            user-select: none;
            display: flex;
            padding: 15px 20px;
            font-size: 14px;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background-color: rgb(39, 52, 62);
            svg {
                margin-right:10px;
            }
            span {
                color:#FFFFFF;
            }
        }
    }
`;

export default CommentListItem;