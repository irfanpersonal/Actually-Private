import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {searchUsers} from '../features/search/searchThunk';
import {Link} from 'react-router-dom';
import {PaginationBox} from '../components';

const Search = () => {
    const dispatch = useDispatch();
    const {isLoading, users, totalUsers, numberOfPages} = useSelector(store => store.search);
    React.useEffect(() => {
        dispatch(searchUsers());
    }, []);
    return (
        <>
            {isLoading ? (
                <h1>Loading Users...</h1>
            ) : (
                <section>
                    <h1 style={{padding: '0.5rem', textAlign: 'center', backgroundColor: 'lightblue'}}>Users</h1>
                    <h1 style={{margin: '1rem 0'}}>{totalUsers} User{totalUsers > 1 && 's'} Found...</h1>
                    {users.map(user => {
                        const {profilePicture, name, _id: userID} = user;
                        return (
                            <article key={user._id} style={{border: '1px solid black', padding: '1rem', marginTop: '1rem'}}>
                                {profilePicture ? (
                                    <img style={{width: '50px', height: '50px'}} src={profilePicture} alt={name}/>
                                ) : (
                                    <h1>No Profile Picture</h1>
                                )}
                                <h1>{name}</h1>
                                <Link to={`/profile/${userID}`}>Go to Profile</Link>
                            </article>
                        );
                    })}
                    {numberOfPages > 1 && (
                        <PaginationBox/>
                    )}
                </section>
            )}
        </>
    );
}

export default Search;