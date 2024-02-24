import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {type CommentType} from '../features/singlePost/singlePostSlice';
import {FaHeart} from 'react-icons/fa';
import {useDispatch, useSelector} from 'react-redux';
import {useDispatchType, useSelectorType} from '../store';
import {useParams, Link} from 'react-router-dom';
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
            <div className="user-info">
                <img src={data.user.profilePicture || emptyProfilePicture}/>
                <div><Link onClick={() => {
                }} className="link" to={`/user/${data.user._id}`}>{data.user.name}</Link></div>
            </div>
            <div className="comment-data">
                <div>
                    {isEditing ? (
                        <>
                            <textarea id="content" name="content" defaultValue={data.content} required></textarea>
                            <div onClick={() => {
                                const formData = new FormData();
                                formData.append('content', (document.querySelector('#content') as HTMLTextAreaElement).value);
                                dispatch(editSinglePostComment({postID: postID!, commentID: data._id, data: formData}));
                            }} className="btn">Edit</div>
                        </>
                    ) : (
                        <div>{data.content}</div>
                    )}
                    {data.myComment && (
                        <>
                            <div onClick={toggleIsEditing} className="btn">{isEditing ? 'Cancel' : 'Edit'}</div>
                            <div className="btn" onClick={() => {
                                if (deleteSinglePostCommentLoading) {
                                    return;
                                }
                                dispatch(deleteSinglePostComment({postID: postID!, commentID: data._id}));
                            }}>Delete</div>
                        </>
                    )}
                </div>
                <div>
                    <div onClick={() => {
                        if (data.liked) {
                            dispatch(unlikeSinglePostComment({postID: postID!, commentID: data._id}));
                            return;
                        }
                        dispatch(likeSinglePostComment({postID: postID!, commentID: data._id}));
                    }} className={`icon ${data.liked ? 'liked' : 'unliked'}`}><FaHeart/> {data.likes.length}</div>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    outline: 1px solid black;
    margin: 1rem 0;
    padding: 1rem;
    display: flex;
    .icon {
        cursor: pointer;
    }
    .user-info {
        margin-right: 1rem;
        img {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            outline: 1px solid black;
        }
    }
    .comment-data {
        width: 100%;
        padding: 0.5rem;
        background-color: lightgray;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .btn {
            cursor: pointer;
            display: inline-block;
            outline: 1px solid black;
            padding: 0.25rem;
            margin: 0.5rem 0;
            margin-right: 0.5rem;
        }
        .btn:hover, .btn:active {
            background-color: gray;
        }
    }
    #content {
        width: 100%;
        resize: none;
        height: 3rem;
        padding: 0.25rem;
    }
    .link {
        color: black;
    }
`;

export default CommentListItem;