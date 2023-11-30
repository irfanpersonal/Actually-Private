import {createSlice} from "@reduxjs/toolkit";
import {likePost, unlikePost} from "../posts/postsThunk";
import {createComment, createNestedComment, deleteComment, likeComment, unlikeComment} from "../comment/commentThunk";
import {toast} from 'react-toastify';

const initialState = {
    post: null,
    comments: [],
    isLoadingNestedCommentCreation: false
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setPost: (state, action) => {
            state.post = action.payload;
        },
        setComments: (state, action) => {
            state.comments = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(likePost.fulfilled, (state, action) => {
            if (state.post) {
                state.post.likes.push(action.payload.userID);
            }
        }).addCase(unlikePost.fulfilled, (state, action) => {
            if (state.post) {
                state.post.likes = state.post.likes.filter(userId => userId !== action.payload.userID);
            }
        }).addCase(createComment.fulfilled, (state, action) => {
            state.comments.push(action.payload);
        }).addCase(likeComment.fulfilled, (state, action) => {
            const {commentID, userID} = action.payload;
            const commentIndex = state.comments.findIndex(comment => comment._id === commentID);
            if (commentIndex !== -1) {
                state.comments[commentIndex].likes.push(userID);
            }
            toast.success('Liked Comment!');
        }).addCase(unlikeComment.fulfilled, (state, action) => {
            const {commentID, userID} = action.payload;
            const commentIndex = state.comments.findIndex(comment => comment._id === commentID);
            if (commentIndex !== -1) {
                const likesArray = state.comments[commentIndex].likes;
                const userIndex = likesArray.indexOf(userID);
                if (userIndex !== -1) {
                    likesArray.splice(userIndex, 1); 
                }
            }
            toast.success('Unliked Comment!');
        }).addCase(createNestedComment.pending, (state, action) => {
            state.isLoadingNestedCommentCreation = true;
        }).addCase(createNestedComment.fulfilled, (state, action) => {
            state.isLoadingNestedCommentCreation = false;
            toast.success('Created Nested Comment');
        }).addCase(createNestedComment.rejected, (state, action) => {
            state.isLoadingNestedCommentCreation = false;
        }).addCase(deleteComment.fulfilled, (state, action) => {
            state.comments = state.comments.filter(item => item._id !== action.payload.commentID);
            toast.success('Deleted Comment!');
        });
    }
});

export const {setPost, setComments} = postSlice.actions;

export default postSlice.reducer;