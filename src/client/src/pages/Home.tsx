import React from 'react';
import styled from 'styled-components';
import {nanoid} from 'nanoid';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, UserBox} from '../components';
import {getUserFeed} from '../features/userFeed/userFeedThunk';
import {TrendingBox, PostsListItem} from '../components';
import {setPage} from '../features/userFeed/userFeedSlice';
import {AddPost} from '../pages';

const Home: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {getUserFeedLoading, completedUserFeed, numberOfPages, page} = useSelector((store: useSelectorType) => store.userFeed);
    React.useEffect(() => {
        dispatch(getUserFeed());
    }, []);
    return (
        <Wrapper>
            <div className="container">
                <UserBox/>
                <div className="half">
                    <AddPost/>
                    {getUserFeedLoading ? (
                        <Loading title='Loading User Feed' position='normal' marginTop='1rem'/>
                    ) : (
                        <>
                            {completedUserFeed.map(post => {
                                return (
                                    <PostsListItem key={nanoid()} data={post} hide={false}/>
                                );
                            })}
                            {(numberOfPages! >= 2 && page !== numberOfPages) && (
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
                </div>
                <TrendingBox/>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .copyButton {
        min-width: 49px;
        color: #FFFFFF;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        border: 2px solid #27343e;
    }
    .postTextarea {
        height: 50px;
        resize: none;
        display: flex;
        flex-direction: column;
        font-size: 16px;
        border-width: 0px;
        border-radius: 10px;
        background-color: #27343e;
        padding: 12px 15px 10px 15px;
    }
`;

export default Home;