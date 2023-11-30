import React from 'react';
import styled from 'styled-components';
import {NavLink, useNavigate} from 'react-router-dom';
import {BiBoltCircle, BiSolidBoltCircle, BiSolidUserCircle, BiSearch} from "react-icons/bi";
import {useDispatch, useSelector} from 'react-redux';
import {updateSearch} from '../features/search/searchSlice';
import {searchUsers} from '../features/search/searchThunk';
import {setThemeForLocalStorage} from '../utils';
import {setTheme} from '../features/user/userSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user, theme} = useSelector(store => store.user);
    const {search} = useSelector(store => store.search);
    const handleClick = () => {
        setThemeForLocalStorage(theme === 'light' ? 'dark' : 'light');
        dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
        document.querySelector('body').style.backgroundColor = theme === 'light' ? 'darkgray' : 'white'; 
    }
    React.useEffect(() => {
        document.querySelector('body').style.backgroundColor = theme === 'light' ? 'darkgray' : 'white'; 
    }, [theme]);
    return (
        <Wrapper>
            <h1><NavLink to='/'>Actually <span className="logo">Private</span></NavLink></h1>
            <div>
                <input type="search" name="search" placeholder='Search Users' value={search} onChange={(event) => dispatch(updateSearch(event.target.value))}/>
                <button onClick={() => {
                    navigate('/search');
                    dispatch(searchUsers());
                }}><BiSearch/></button>
            </div>
            <div>
                <span onClick={handleClick} className="icons">{theme === 'light' ? <BiBoltCircle/> : <BiSolidBoltCircle/>}</span>
                <NavLink className="icons" to={user ? '/profile' : '/auth'}><BiSolidUserCircle/></NavLink>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;    
    background-color: lightgray;
    padding: 0.5rem;
    border-bottom: 1px solid black;
    a {
        text-decoration: none;
        color: black;
    }
    .logo {
        background-color: black;
        color: white;
        padding: 0.10rem 1rem;
    }
    .icons {
        cursor: pointer;
        font-size: 2rem;
        color: black;
        border: 1px solid black;
        background-color: white;
        margin-right: 1rem;
        background-color: lightyellow;
    }
    input {
        width: 50vw;
        padding: 0.5rem;
        border: none;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        border-left: 1px solid black;
        outline: none;
    }
    button {
        padding: 0.5rem;
        border: 1px solid black;
    }
    button:active {
        background-color: white;
    }
`;

export default Navbar;