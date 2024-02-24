import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {nanoid} from 'nanoid';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getGlobalSearch, getSuggestedUsers} from '../features/search/searchThunk';
import {FaSearch} from 'react-icons/fa';
import {Loading, PostsList, PaginationBox} from '../components';
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
            <div className="search-box">
                <div className="search">
                    <input id="search" type="search" name="search" value={search} onChange={(event) => {
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
                <div className="title">Suggested Users</div>
                {getSuggestedUsersLoading ? (
                    <div className="loading">Loading People...</div>
                ) : (
                    <>
                        {!suggestedUsers.length && (
                            <div style={{marginTop: '0.25rem'}}>No Suggested Users Found...</div>
                        )}
                        {suggestedUsers.map(user => {
                            return (
                                <article className="user-container" onClick={() => {
                                    navigate(`/user/${user._id}`);
                                }} key={nanoid()}>
                                    <div className="user-box">
                                        <img src={user.profilePicture || emptyProfilePicture} alt={user.name}/>
                                        <div>{user.name}</div>
                                    </div>
                                </article>
                            );
                        })}
                    </>
                )}
            </div>
            {globalSearchLoading ? (
                <Loading title="Loading Search Results" position='normal' marginTop='1rem'/>
            ) : (
                <>
                    {posts.length ? (
                        <PostsList data={posts!} totalPosts={totalPosts!} hide={false}/>
                    ) : (
                        <div className="no-posts">No Posts Found...</div>
                    )}
                    {numberOfPages! > 1 && (
                        <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getGlobalSearch}/>
                    )}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .search-box {
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
            outline: 1px solid black;
        }
    }
    .people-box {
        outline: 1px solid black;
        padding: 0.25rem;
        margin: 1rem 0;
        .title {
            border-bottom: 1px solid black;
        }
        .loading {
            text-align: center;
            margin: 1rem 0;
        }
        .user-container {
            padding: 0.25rem;
            .user-box {
                cursor: pointer;
                margin-top: 0.25rem;
                img {
                    width: 1.5rem;
                    height: 1.5rem;
                    outline: 1px solid black;
                    margin-right: 0.5rem;
                }
                display: flex;
                align-items: center;
            }
            .user-box:active, .user-box:hover {
                background-color: lightgray;
                outline: 1px solid black;
            }
        }
    }
    .no-posts {
        text-align: center;
        background-color: black;
        color: white;
        padding: 0.25rem;
    }
`;

export default Search;