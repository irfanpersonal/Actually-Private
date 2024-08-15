import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {nanoid} from 'nanoid';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getGlobalSearch, getSuggestedUsers} from '../features/search/searchThunk';
import {FaSearch} from 'react-icons/fa';
import {Loading, PostsList, PaginationBox, UserBox, TrendingBox} from '../components';
import {setPage, setSearch} from '../features/search/searchSlice';
import {useNavigate} from 'react-router-dom';

const Search: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const {globalSearchLoading, posts, totalPosts, numberOfPages, page, search, getSuggestedUsersLoading, suggestedUsers} = useSelector((store: useSelectorType) => store.search)
    React.useEffect(() => {
        dispatch(getGlobalSearch());
        dispatch(getSuggestedUsers());
    }, []);
    return (
        <Wrapper>
            <div className="container">
                <UserBox/>
                <div className="half">
                    <div className="search-box">
                        <div className="search">
                            <input id="search" type="search" name="search" placeholder="Search here" value={search} onChange={(event) => {
                                dispatch(setSearch(event.target.value));
                            }}/>
                            <button onClick={() => {
                                dispatch(getGlobalSearch());
                            }}>
                                <FaSearch/>
                            </button>
                        </div>
                    </div>
                    <div className="people-box">
                        <div className="title">Users</div>
                        {getSuggestedUsersLoading ? (
                            <div className="loading">Loading People.</div>
                        ) : (
                            <div className="searchPostResponse">
                            <>
                                {!suggestedUsers.length && (
                                    <div className="noResponse">No users Found.</div>
                                )}
                                {suggestedUsers.map(user => {
                                    console.log(user);
                                    return (
                                        <article className="user-container" onClick={() => {
                                            navigate(`/user/${user._id}`);
                                        }} key={nanoid()}>
                                            <div className="user-box">
                                                <img src={user.profilePicture || emptyProfilePicture} alt={user.name}/>
                                                <div>
                                                    <div className="nickName">{user.nickName}</div>
                                                    <div className="createdAt">@{user.name}</div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </>
                            </div>
                        )}
                    </div>
                    {globalSearchLoading ? (
                        <Loading title="Loading Search Results" position='normal' marginTop='1rem'/>
                    ) : (
                        <>
                            {posts.length ? (
                                <PostsList data={posts!} totalPosts={totalPosts!} hide={false}/>
                            ) : (
                                <div>
                                    <div className="suTitle">Suggested Users</div>
                                    <div className="noResponse">No Posts Found...</div>
                                </div>
                            )}
                            {numberOfPages! > 1 && (
                                <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getGlobalSearch}/>
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
    .search-box {
        padding:10px;
        .search {
            padding:20px;
            display: flex;
            align-items: center;
            border-radius: 12px;
            justify-content: space-between;
            background-color:rgb(28, 39, 48);
        }
        input {
            flex:1;
            display:flex;
            color:#FFFFFF;
            border-width:0px;
            padding:10px 15px;
            border-radius:12px;
            background-color:rgb(39, 52, 62);
        }
        button {
            width:40px;
            height:40px;
            border-width:0px;
            margin-left:15px;
            border-radius:12px;
            cursor:pointer;
            background-color:#1c9be8;
            svg {
                color:#FFFFFF;
                margin-bottom:-2px;
            }
        }
        button:hover {
            opacity:0.7;
        }
        .result-box {
            outline: 1px solid black;
        }
    }
    .people-box {
        .searchPostResponse {
            padding:0px;
        }
        .title {
            padding: 10px;
            color:#FFFFFF;
            font-size: 18px;
            font-weight: 500;
        }
        .loading {
            color:#FFFFFF;
            text-align: center;
            margin: 20px;
        }
        .user-container {
            padding:10px;
            .user-box {
                padding:20px;
                cursor: pointer;
                margin-top: 0.25rem;
                border-radius: 12px;
                background-color: rgb(28, 39, 48);
                img {
                    width: 3.125rem;
                    height: 3.125rem;
                    border-radius:999px;
                    margin-right: 10px;
                }
                display: flex;
                align-items: center;
            }
            .user-box:hover {
                opacity:0.7;
            }
        }
    }
    .no-posts {
        text-align: center;
        background-color: black;
        color: white;
        padding: 0.25rem;
    }
    .nickName {
        font-size: 14px;
        color: white;
    }
    .name {
        font-size: 12px;
        color: #6c7a87;
    }
    .createdAt {
        font-size: 12px;
        color: #6c7a87;    
        margin-top: 2px;
    }
    .noResponse {
        margin:10px;
        padding:20px;
        font-size:14px;
        color:#FFFFFF;
        border-radius:12px;
        background-color:rgb(28, 39, 48);
    }
    .suTitle {
        padding: 10px;
        color:#FFFFFF;
        font-size: 18px;
        font-weight: 500;
    }
    section .list-info {
        padding-top:0px;
    }
`;

export default Search;