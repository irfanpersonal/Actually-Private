import {redirect} from "react-router-dom";
import axios from 'axios';
import {PostItem, CommentList} from "../components";
import {setComments, setPost} from "../features/post/postSlice";
import {useSelector} from "react-redux";
import styled from 'styled-components';

export const loader = (store) => async({context, params, request}) => {
    try {
        const {id} = params;
        const post = await axios.get(`/api/v1/posts/${id}`);
        const postData = post.data.post;
        const allCommentForPost = await axios.get(`/api/v1/posts/${id}/comments`);
        const allCommentForPostData = allCommentForPost.data.comments;
        store.dispatch(setPost(postData));
        store.dispatch(setComments(allCommentForPostData));
        return postData;
    }
    catch(error) {
        return redirect('/');
    }
}

const Post = () => {
    const {post, comments} = useSelector(store => store.post);
    return (
        <>
            <PostItem data={post}/>
            <CommentList data={comments}/>
        </>
    );
}

export default Post;