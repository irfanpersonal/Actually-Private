import React from 'react';
import styled from 'styled-components';
import {Loading, TrendingTopicsList, UsersList, UserBox} from '../components';
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
            <div className="container">
                <UserBox/>
                <div className="half">
                    <div className="exploreUnit">
                        <div className="inner">

                            {getTrendingTopicsLoading ? (
                            <Loading title="Loading Trending Topics" position='normal' marginTop='1rem'/>
                            ) : (
                                <>
                                    {trendingTopics.length ? (
                                        <TrendingTopicsList data={trendingTopics}/>
                                    ) : (
                                        <div style={{textAlign: 'center',fontSize:'14px',}}>No Trending Topics</div>
                                    )}
                                </>
                            )}
                        </div>
                        
                    </div>
                    
                </div> 
                <div className="quarter">
                    <div className="trendingInfo">
                        <div className="inner">
                            <div className="pad10">
                                <div className="f16 cWhite semiBold padBottom10 underline">How it works</div>
                                <div className="f14 cGray">If you were wondering how our trending section is compiled, then look no further.</div>
                            </div>
                        </div>
                    </div>
                    <div className="search">
                        <div className="inner">
                            <div className="pad10">
                                <div className="f16 cWhite semiBold padBottom10 underline">Search AP</div>
                                <div className="f14 cGray">Search the Actually Private platform to see if anyone has posted anything that you are looking for.</div>
                            </div>
                            
                            <div className="searchBox">
                                <div className="searchUnit">
                                    <input id="search" type="search" name="search" placeholder="Search here" value={search} onFocus={() => {
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
                                    <button className="searchSubmit" onClick={() => {
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
                            
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .exploreUnit , .search , .trendingInfo {
        padding:10px;
        .inner {
            border-radius:12px;
            background-color:rgb(28, 39, 48);
        }
    }
    .search {
        padding:10px;
        .searchBox {
            display:flex;
            padding:10px;
            flex-direction:column;
            .searchUnit {
                flex:1;
                display:flex;
                padding:10px;
                border-radius:12px;
                background-color:#06141d;
                .searchSubmit {
                    width:24px;
                    height:24px;
                    cursor:pointer;
                    border-width:0px;
                    border-radius:8px;
                    background-color:#1c9be8;
                    svg {
                        font-size:12px;
                        color:#FFFFFF;
                        margin-bottom:-1px;
                    }
                }
                .searchSubmit:hover {
                    opacity:0.7;
                }
            }
            input {
                flex:1;
                display:flex;
                color:#FFFFFF;
                outline:0px solid;
                border-color:transparent;
                background-color:transparent;
            }
            input::placeholder {
                color:#6c7a87;
            }
        }
    }
    article:nth-last-child(1) .topic {
        margin-bottom:10px;
        /* border-bottom-width:0px; */
    }
`;

export default Explore;