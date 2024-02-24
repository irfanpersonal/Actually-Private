import {createSlice} from '@reduxjs/toolkit';
import {type PostType, type UserType} from '../profile/profileSlice';
import {getSinglePost, getSinglePostComments, deleteSinglePost, likeSinglePost, unlikeSinglePost, likeSinglePostComment, unlikeSinglePostComment, deleteSinglePostComment, editSinglePostComment, updateSinglePost} from './singlePostThunk';
import {toast} from 'react-toastify';

interface ISinglePost {
    getSinglePostLoading: boolean,
    getSinglePostCommentsLoading: boolean,
    editSinglePostLoading: boolean,
    deleteSinglePostLoading: boolean,
    deleteSinglePostCommentLoading: boolean,
    editSinglePostCommentLoading: boolean,
    singlePost: PostType | null,
    msg: string,
    redirectHome: boolean | null,
    yourPost: boolean | null,
    liked: boolean | null,
    comments: CommentType[],
    totalComments: number | null,
    numberOfPages: number | null,
    page: number
}

export type CommentType = {
    _id: string,
    user: UserType,
    post: string,
    content: string,
    likes: string[],
    liked: boolean,
    myComment: boolean,
    createdAt: string,
    updatedAt: string
}

const initialState: ISinglePost = {
    getSinglePostLoading: true,
    getSinglePostCommentsLoading: true,
    editSinglePostLoading: false,
    deleteSinglePostLoading: false,
    deleteSinglePostCommentLoading: false,
    editSinglePostCommentLoading: false,
    singlePost: null,
    msg: '',
    redirectHome: null,
    yourPost: null,
    liked: null,
    comments: [],
    totalComments: null,
    numberOfPages: null,
    page: 1
};

const singlePostSlice = createSlice({
    name: 'singlePost',
    initialState,
    reducers: {
        setRedirectHome: (state, action) => {
            state.redirectHome = action.payload;
        },
        resetPage: (state) => {
            state.page = 1;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSinglePost.pending, (state) => {
            state.getSinglePostLoading = true;
        }).addCase(getSinglePost.fulfilled, (state, action) => {
            state.getSinglePostLoading = false;
            state.singlePost = action.payload.post;
            state.msg = action.payload.msg;
            state.redirectHome = action.payload.redirectHome;
            state.yourPost = action.payload.yourPost;
            state.liked = action.payload.liked;
        }).addCase(getSinglePost.rejected, (state, action) => {
            state.getSinglePostLoading = true;
        }).addCase(deleteSinglePost.pending, (state) => {
            state.deleteSinglePostLoading = true;
        }).addCase(deleteSinglePost.fulfilled, (state, action) => {
            state.deleteSinglePostLoading = false;
            toast.success('Deleted Post!');
        }).addCase(deleteSinglePost.rejected, (state) => {
            state.deleteSinglePostLoading = false;
        }).addCase(likeSinglePost.fulfilled, (state) => {
            state.liked = true;
            state.singlePost!.likes.push('some value');
        }).addCase(unlikeSinglePost.fulfilled, (state) => {
            state.liked = false;
            state.singlePost!.likes.pop();
        }).addCase(getSinglePostComments.pending, (state) => {
            state.getSinglePostCommentsLoading = true;
        }).addCase(getSinglePostComments.fulfilled, (state, action) => {
            state.getSinglePostCommentsLoading = false;
            state.comments = action.payload.comments;
            state.totalComments = action.payload.totalComments;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getSinglePostComments.rejected, (state, action) => {
            state.getSinglePostCommentsLoading = false;
        }).addCase(likeSinglePostComment.fulfilled, (state, action) => {
            const likedComment = state.comments.find(item => item._id === action.meta.arg.commentID);
            likedComment!.liked = true;
            likedComment!.likes.push('some value');
        }).addCase(unlikeSinglePostComment.fulfilled, (state, action) => {
            const unlikedComment = state.comments.find(item => item._id === action.meta.arg.commentID);
            unlikedComment!.liked = false;
            unlikedComment!.likes.pop();
        }).addCase(deleteSinglePostComment.pending, (state) => {
            state.deleteSinglePostCommentLoading = true;
        }).addCase(deleteSinglePostComment.fulfilled, (state, action) => {
            state.deleteSinglePostCommentLoading = false;
        }).addCase(deleteSinglePostComment.rejected, (state, action) => {
            state.deleteSinglePostCommentLoading = true;
        }).addCase(editSinglePostComment.pending, (state) => {
            state.editSinglePostCommentLoading = true;
        }).addCase(editSinglePostComment.fulfilled, (state, action) => {
            state.editSinglePostCommentLoading = false;
            const comment = state.comments.find(comment => comment._id === action.meta.arg.commentID);
            comment!.content = action.payload.content;
        }).addCase(editSinglePostComment.rejected, (state, action) => {
            state.editSinglePostCommentLoading = false;
            toast.error(action.payload as string);
        }).addCase(updateSinglePost.pending, (state) => {
            state.editSinglePostLoading = true;
        }).addCase(updateSinglePost.fulfilled, (state, action) => {
            state.editSinglePostLoading = false;
            state.singlePost!.image = action.payload.image;
            state.singlePost!.content = action.payload.content;
            state.singlePost!.location = action.payload.location;
            toast.success('Edited Post!');
        }).addCase(updateSinglePost.rejected, (state, action) => {
            state.editSinglePostLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {setRedirectHome, resetPage, setPage} = singlePostSlice.actions;

export default singlePostSlice.reducer;