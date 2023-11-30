import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {createNestedComment, deleteComment, likeComment, unlikeComment} from '../features/comment/commentThunk';
import {toast} from 'react-toastify';

const CommentItem = ({data}) => {
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.user);
    // const {isLoadingNestedCommentCreation} = useSelector(store => store.post);
    const {post: postID, content, user: {name, _id: userID}, comments, _id: commentID, likes} = data;
    // const [showCommentBox, setShowCommentBox] = React.useState(false);
    // const toggleShowCommentBox = () => {
    //     setShowCommentBox(currentState => {
    //         return !currentState;
    //     });
    // }
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     if (!user) {
    //         toast.error('You must register/login before you can comment on someones post!');
    //         return;
    //     }
    //     dispatch(createNestedComment({postID, commentID, comment: event.target.elements.content.value}));
    // }
    return (
        <article style={{border: '1px solid black', marginTop: '1rem', padding: '1rem'}}>
            <p><span style={{textDecoration: 'underline'}}><Link to={`/profile/${userID}`}>{name}</Link></span>: {content}</p>
            <button style={{backgroundColor: likes.includes(user?.userID) && 'red'}} onClick={() => {
                if (!user) {
                    toast.error('You must register/login before you can like someones post!');
                    return;
                }
                if (likes.includes(user?.userID)) {
                    dispatch(unlikeComment(commentID));
                    return;
                }
                dispatch(likeComment(commentID));
            }}>Like</button>
            <p>Like Count: {likes.length}</p>
            {user?.userID === userID && (
                <button type="button" onClick={() => dispatch(deleteComment(commentID))}>DELETE</button>
            )}
            {/* <button onClick={toggleShowCommentBox}>Comment</button>
            {showCommentBox && (
                <>
                    <form onSubmit={handleSubmit}>
                        <textarea type="text" name="content" style={{width: '100%', resize: 'none', height: '60px'}}></textarea>
                        <button type="button" style={{padding: '0.5rem', backgroundColor: 'lightblue', margin: '1rem 0'}} onClick={toggleShowCommentBox}>CANCEL</button>
                        <button type="submit" style={{padding: '0.5rem', backgroundColor: 'lightblue'}}>{isLoadingNestedCommentCreation ? 'ADDING' : 'ADD'}</button>
                    </form>
                </>
            )}
            {comments.length >= 1 && (
                <button>Show More Replies</button>
            )} */}
        </article>
    );
}

export default CommentItem;