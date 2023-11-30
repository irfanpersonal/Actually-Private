import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {PostList} from '../components';
import {getAllPosts, getUserFeed} from '../features/posts/postsThunk';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {isEditingFalse, resetSinglePostData} from '../features/addPost/addPostSlice';

const Home = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.user);
    const {isLoadingUserFeed, isLoadingAllPosts, posts} = useSelector(store => store.posts);
    React.useEffect(() => {
        if (user) {
            dispatch(getUserFeed());
            return;
        }
        dispatch(getAllPosts());
    }, []);
    return (
        <Wrapper>
            {user ? (
                <>
                    {isLoadingUserFeed ? (
                        <h1>Loading User Feed...</h1>
                    ) : (
                        <PostList title="My Feed" data={posts}/>
                    )}
                </>
            ) : (
                <>
                    {isLoadingAllPosts ? (
                        <h1>Loading All Posts...</h1>
                    ) : (
                        <PostList title="All Posts" data={posts}/>
                    )}
                </>
            )}
            {user && (
                <Link onClick={() => {
                    dispatch(isEditingFalse());
                    dispatch(resetSinglePostData());
                }} to='/add-post'><div className="add-button">+</div></Link>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .add-button {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        background-color: lightgray;
        color: black;
        border-radius: 50%;
        font-size: 1.5rem;
        border: 1px solid black;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
    }
`;

export default Home;