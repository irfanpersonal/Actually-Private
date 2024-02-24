import React from 'react';
import styled from 'styled-components';
import {nanoid} from 'nanoid';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading} from '../components';
import {getUserFeed} from '../features/userFeed/userFeedThunk';
import {PostsListItem} from '../components';
import {setPage} from '../features/userFeed/userFeedSlice';
import {useNavigate} from 'react-router-dom';

const Home: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const {getUserFeedLoading, completedUserFeed, numberOfPages, page} = useSelector((store: useSelectorType) => store.userFeed);
    React.useEffect(() => {
        dispatch(getUserFeed());
    }, []);
    return (
        <Wrapper>
            {getUserFeedLoading ? (
                <Loading title='Loading User Feed' position='normal' marginTop='1rem'/>
            ) : (
                <>
                    {completedUserFeed.map(post => {
                        return (
                            <PostsListItem key={nanoid()} data={post} hide={false}/>
                        );
                    })}
                    {!(numberOfPages === 1 || page === numberOfPages) && (
                        <button style={{width: '100%', padding: '0.5rem'}} onClick={() => {
                            const newPage = page + 1;
                            if (newPage > numberOfPages!) {
                                return;
                            }
                            dispatch(setPage(newPage));
                            dispatch(getUserFeed());
                        }}>View More</button>
                    )}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .title {
        background-color: black;
        color: white;
        padding: 0.5rem;
        text-align: center;
        margin-bottom: 1rem;
    }
    .view-more {
        padding: 0.25rem;
        cursor: pointer;
        background-color: lightgray;
        text-align: center;
        outline: 1px solid black;
    }
    .view-more:active, .view-more:hover {
        background-color: gray;
    }
`;

export default Home;