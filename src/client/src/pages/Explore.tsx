import React from 'react';
import styled from 'styled-components';
import {Loading, TrendingTopicsList, UsersList} from '../components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getTrendingTopics, getAllUsers} from '../features/explore/exploreThunk';
import {FaSearch} from 'react-icons/fa';
import {setSearchForExplore, resetAllUsersData} from '../features/explore/exploreSlice';
import {setSearch} from '../features/search/searchSlice';
import {useNavigate} from 'react-router-dom';

const Explore: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const [showResults, setShowResults] = React.useState(false);
    const {getTrendingTopicsLoading, trendingTopics, search, getAllUsersLoading, users, totalUsers, numberOfPages, page} = useSelector((store: useSelectorType) => store.explore);
    React.useEffect(() => {
        dispatch(getTrendingTopics());
    }, []);
    return (
        <Wrapper>
            <div className="explore-box">
                <div className="search">
                    <input id="search" type="search" name="search" value={search} onFocus={() => {
                        setShowResults(currentState => {
                            return true;
                        });
                    }} onBlur={() => {
                        const theResultBox = document.querySelector('.result-box') as HTMLDivElement;
                        if (theResultBox?.matches(':active')) {
                            return;
                        }
                        setShowResults(currentState => {
                            return false;
                        });
                    }} onChange={(event) => {
                        setShowResults(currentState => {
                            return true;
                        });
                        dispatch(setSearchForExplore(event.target.value));
                        if (event.target.value) {
                            dispatch(getAllUsers());
                        }
                        if (!event.target.value) {
                            dispatch(resetAllUsersData());
                        }
                    }}/>
                    <button onClick={() => {
                        dispatch(setSearch(search));
                        navigate('/search');
                    }}>
                        <FaSearch/>
                    </button>
                </div>
                {showResults && (
                    <div className="result-box">
                        {getAllUsersLoading ? (
                            <div className="users-loading">Loading...</div>
                        ) : (
                            <>
                                <UsersList data={users} search={search}/>
                                {/* No Point of Adding Pagination Box */}
                                {/* {(numberOfPages! > 1)  && (
                                    <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getAllUsers}/>
                                )} */}
                            </>
                        )}
                    </div>
                )}
            </div>
            {getTrendingTopicsLoading ? (
                <Loading title="Loading Trending Topics" position='normal' marginTop='1rem'/>
            ) : (
                <>
                    {trendingTopics.length ? (
                        <TrendingTopicsList data={trendingTopics}/>
                    ) : (
                        <div style={{textAlign: 'center', borderBottom: '1px solid black'}}>No Trending Topics</div>
                    )}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .explore-box {
        position: relative;
        margin: 1rem auto;
        width: 50%;
        border-radius: 2rem;
        .search {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        input {
            width: 75%;
            padding: 0.25rem;
        }
        button {
            width: 25%;
            padding: 0.25rem;
            cursor: pointer;
        }
        button:hover, button:active {
            color: gray;
        }
        .result-box {
            background-color: white;
            width: 75%;
            border-left: 1px solid black;
            border-right: 1px solid black;
            border-bottom: 1px solid black;
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1;
            .users-loading {
                text-align: center;
            }
        }
    }
`;

export default Explore;