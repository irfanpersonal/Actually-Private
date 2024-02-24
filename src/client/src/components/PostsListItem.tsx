import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {PostType} from '../features/profile/profileSlice';
import {FaHeart, FaRegCommentDots} from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom';
import {likePost, unlikePost} from '../features/post/postThunk';
import {setRedirectHome} from '../features/singlePost/singlePostSlice';

interface PostsListItemProps {
    data: PostType,
    hide: boolean
}

const PostsListItem: React.FunctionComponent<PostsListItemProps> = ({data, hide}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    return (
        <Wrapper>
            {!hide && (
                <div className="post-header">  
                    <img className="profile-picture" src={data.user.profilePicture || emptyProfilePicture} alt={data.user.name}/> 
                    <div className="post-info">
                        <div><Link to={`/user/${data.user._id}`} className="user-name">{data.user.name}</Link></div>
                        <div>{data.location}</div>
                    </div>
                </div>
            )}
            <img className="post-image" src={data.image} alt={data.user.name}/>
            <div className="post-actions">
                <div onClick={() => {
                    if (data.liked) {
                        dispatch(unlikePost(data._id));
                        return;
                    }
                    dispatch(likePost(data._id));
                }} className={`icon ${data.liked ? 'liked' : 'unliked'}`}><FaHeart/></div>
                <div onClick={() => {
                    dispatch(setRedirectHome(false));
                    navigate(`/post/${data._id}`);
                }} className="icon"><FaRegCommentDots/></div>
            </div>
            <div><Link to={`/user/${data.user._id}`} className="user-name">{!hide ? data.user.name : 'You'}</Link>: {data.content}</div>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    border-radius: 1rem;
    outline: 1px solid black;   
    padding: 0.5rem;
    margin-bottom: 1rem;
    background-color: lightgray;
    .post-header {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        .post-info {
            margin-left: 1rem;
        }
        .profile-picture {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            outline: 1px solid black;
        }
    }
    .user-name {
        text-decoration: underline;
        color: black;
    }
    .post-image {
        border-radius: 1rem;
        width: 100%;
        height: 20rem;
        outline: 1px solid black;
    }
    .post-actions {
        display: flex;
        .icon {
            cursor: pointer;
            margin-right: 1rem;
        }
    }
    .unliked {
        color: gray;
    }
    .liked {
        color: red;
    }
`;

export default PostsListItem;