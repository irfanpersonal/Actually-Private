import React from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {CiHeart} from "react-icons/ci";
import {FaRegMessage} from "react-icons/fa6";
import {likePost, unlikePost} from '../features/posts/postsThunk';
import {toast} from 'react-toastify';
import {createComment} from '../features/comment/commentThunk';
import {isEditingTrue} from '../features/addPost/addPostSlice.js';
import {getSinglePost} from '../features/addPost/addPostThunk.js';

const PostItem = ({data}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(store => store.user);
    const {_id, image, content, createdAt, user: {name, _id: userID}, likes} = data;
    const {isLoading} = useSelector(store => store.comment);
    const [showCommentBox, setShowCommentBox] = React.useState(false);
    const toggleCommentBox = () => {
        setShowCommentBox(currentState => {
            return !currentState;
        });
    }
    const [input, setInput] = React.useState('');
    const handleSumbit = (event) => {
        event.preventDefault();
        if (!user) {
            toast.error('You must register/login before you can comment on someones post!');
            return;
        }
        dispatch(createComment({postID: _id, comment: input}));
    }
    return (
        <>
            <Link to={`/post/${_id}`} style={{textDecoration: 'none', color: 'black'}}>
                <article style={{padding: '1rem', border: '1px solid black', marginTop: '1rem'}}>
                    <img src={image} style={{width: '100%', height: '300px', border: '1px solid black'}}/>
                    <h3 style={{textAlign: 'center'}}>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h3>
                </article>
            </Link>
            <p><Link style={{color: 'black'}} to={user?.name === name ? `/profile` : `/profile/${userID}`}><span style={{textDecoration: 'underline'}}>{name}</span></Link> : {content}</p>
            <p>Like Count: {likes.length}</p>
            <span>Like: <CiHeart style={{backgroundColor: likes.includes(user?.userID) && 'red'}} onClick={() => {
                if (!user) {
                    toast.error('You must register/login before you can like someones post!');
                    return;
                }
                if (likes.includes(user.userID)) {
                    dispatch(unlikePost({postID: _id, userID: user.userID}));
                    return;
                }
                dispatch(likePost({postID: _id, userID: user.userID}));
            }}/></span>
            <span>Comment: <FaRegMessage onClick={toggleCommentBox}/></span>
            {userID === user?.userID && (
                <button onClick={() => {
                    navigate('/add-post');
                    dispatch(isEditingTrue());
                    dispatch(getSinglePost(_id));
                }}>EDIT</button>
            )}
            {showCommentBox && (
                <>
                    <form onSubmit={handleSumbit}>
                        <textarea type="text" name="content" style={{width: '100%', resize: 'none', height: '60px'}} value={input} onChange={(event) => setInput(currentState => event.target.value)}></textarea>
                        <button type="button" style={{padding: '0.5rem', backgroundColor: 'lightblue', margin: '1rem 0'}} onClick={toggleCommentBox}>CANCEL</button>
                        <button type="submit" style={{padding: '0.5rem', backgroundColor: 'lightblue'}}>{isLoading ? 'ADDING' : 'ADD'}</button>
                    </form>
                </>
            )}
        </>
    );
}

export default PostItem;