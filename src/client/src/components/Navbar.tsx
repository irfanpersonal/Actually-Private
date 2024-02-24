import styled from 'styled-components';
import {NavLink} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {resetEverything} from '../features/userFeed/userFeedSlice';
import {FaHome, FaSearch, FaUser, FaEdit} from "react-icons/fa";

const Navbar: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    return (
        <Wrapper>
            <div className="logo">Actually Private</div>
            <div className="nav-links">
                <NavLink to='/' onClick={() => {
                    dispatch(resetEverything());
                }}><FaHome/>Home</NavLink>
                <NavLink to='/explore'><FaSearch/>Explore</NavLink>
                <NavLink to='/profile'><FaUser/>Profile</NavLink>
                <NavLink to='/add-post'><FaEdit/>Create Post</NavLink>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 20%;
    border-right: 1px solid black;
    height: 100vh;
    .logo {
        background-color: black;
        color: white;
        text-align: center;
        padding: 0.5rem;
    }
    .nav-links {
        display: flex;
        flex-direction: column;
        margin: 1rem 0;
        a {
            outline: 1px solid black;
            background-color: white;
            margin-bottom: 1rem;
            padding: 0.5rem;
            text-decoration: none;
            color: black;
            display: flex;
            justify-content: center;
            align-items: center;
            svg {
                margin-right: 0.5rem;
            }
        }
        a:hover, a:active {
            background-color: gray;
        }
        .active {
            background-color: lightgray;
        }
    }
`;

export default Navbar;