import React, {useState} from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type useDispatchType, type useSelectorType } from '../store';
import { FaHouse, FaCircleUser, FaCompress, FaSortUp, FaSortDown, FaMagnifyingGlass } from 'react-icons/fa6';
import { resetEverything } from '../features/userFeed/userFeedSlice';
import { logoutUser } from '../features/user/userThunk';
import { setSearch } from '../features/search/searchSlice';
import {getGlobalSearch} from '../features/search/searchThunk';

const Navbar: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const { user } = useSelector((store: useSelectorType) => store.user);
    const [showOptions, setShowOptions] = React.useState<boolean>(false);
    const [searchValue, setSearchValue] = useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    // Ref to track the logout button menu
    const optionsRef = React.useRef<HTMLDivElement>(null);

    // Close the options menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const searchValue = (target.elements.namedItem('search') as HTMLInputElement).value;
        dispatch(setSearch(searchValue));
        dispatch(getGlobalSearch());
        navigate('/search');
        setSearchValue('');
    };

    return (
        <Wrapper>
            <div className="headerLeft">
                <div className="logo nUnderline" onClick={() => { if (window.location.pathname !== '/') { dispatch(resetEverything()); navigate('/'); } }}>AP</div>
                <form onSubmit={handleSubmit}>
                    <input name="search" className="search" placeholder="Search AP..." value={searchValue} onChange={handleChange} />
                    {searchValue && (
                        <button type="submit"><FaMagnifyingGlass /></button>
                    )}
                </form>
            </div>
            <div className="headerRight">
                <div className="mainMenu">
                    <div className="menuWrapper" onClick={() => { if (window.location.pathname !== '/') { dispatch(resetEverything()); navigate('/'); } }}>
                        <div className={`menuItem ${window.location.pathname === '/' && 'active'}`}>
                            <FaHouse />
                            <div className="menuLabel">Home</div>
                        </div>
                    </div>
                    
                    <div className="menuWrapper" onClick={() => navigate('/explore')}>
                        <div className={`menuItem ${window.location.pathname === '/explore' && 'active'}`}>
                            <FaCompress />
                            <div className="menuLabel">Explore</div>
                        </div>
                    </div>
                    
                    <div className="menuWrapper" onClick={() => navigate('/profile')}>
                        <div className={`menuItem ${window.location.pathname === '/profile' && 'active'}`}>
                            <FaCircleUser />
                            <div className="menuLabel">Profile</div>
                        </div>
                    </div>
                    
                </div>
                
                <div className="headerProfileSeperator"></div>
                <div 
                    className="profile-cell" 
                    onClick={() => setShowOptions(currentState => !currentState)}
                >
                    <div className="cell-items">
                        <div>{user?.name}</div>
                        <div>{showOptions ? <FaSortUp className="arrow-up"/> : <FaSortDown className="arrow-down"/>}</div>
                    </div>
                    {showOptions && (
                        <div className="hidden-option" ref={optionsRef} onClick={() => {
                            dispatch(logoutUser());
                            navigate('/landing');
                        }}>Logout</div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    padding:15px 20px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
    margin-top:10px;
    .headerLeft {
        display:flex;
        flex-direction:row;
        align-items:center;
        form {
            position:relative;
            button {
                top:7px;
                right:6px;
                width:25px;
                height:25px;
                cursor:pointer;
                border-width:0px;
                border-radius:8px;
                position:absolute;
                background-color:#1c9be8;
            }
            svg {
                font-size:12px;
                color:#FFFFFF;
                margin-bottom:-1px;
            }
        }
    }
    .logo {
        user-select: none;
        color:#FFFFFF;
        font-weight:600;
        font-size:18px;
        margin-right:20px;
        cursor:pointer;
    }
    .logo:hover {
        opacity:0.7;
    }
    .search {
        width:260px;
        color:#FFFFFF;
        border-width:0px;
        border-radius:8px;
        padding:10px 30px 10px 20px;
        background-color:#27343e;
    }
    .headerRight {
        display:flex;
        flex-direction:row;
        align-items:center;
    }
    .mainMenu {
        display:flex;
        flex-direction:row;
        align-items: center;
    }
    .menuItem {
        display:flex;
        flex-direction:row;
        align-items: center;
        padding:10px 15px;
        border-radius:999px;
        .active {
            background-color: gray;
        }
    }
    .menuItem svg {
        color: #c7d6e6;
        cursor: pointer;
    }
    .menuLabel { 
        display: none; 
        font-size: 12px;
        margin-left: 10px;
    }
    .menuItem.active {
        background-color: #FFFFFF;
    }
    .menuItem.active .menuLabel {
        display: flex;
    }
    .menuItem.active svg {
        color: #1c9be8;
    }
    .headerProfileSeperator {
        width: 1px; 
        height: 24px;
        margin: 0px 25px 0px 10px;
        background-color: #27343e;
    }
    .profile-cell {
        cursor: pointer;
        position:relative;
        user-select: none;
        padding: 5px 15px;
        border-radius: 999px;
        background-color: rgb(28, 39, 48);
        .cell-items {
            display: flex;
            font-size:14px;
            color: #FFFFFF;
            align-items: center;
            justify-content: space-between;
            .arrow-up {
                margin-left: 6px;
                position: relative;
                top: 6px;
            }
            .arrow-down {
                margin-left: 6px;
                position: relative;
                bottom: 2px;
            }
        }
        .hidden-option {
            left:0px;
            right:0px;
            padding:6px 0px;
            font-size:14px;
            color:#6c7a87;
            margin-top:10px;
            position:absolute;
            text-align: center;
            border-radius:999px;
            background-color: #1c2730;
        }
        .hidden-option:hover {
            opacity:0.7;
        }
    }
    .profile-cell:hover {
        opacity:0.7;
    }
    @media (max-width:768px) {
        .mainMenu {
            flex:1;
            left:0px;
            right:0px;
            bottom:0px;
            z-index:9999;
            position:fixed;
            padding:20px 0px;
            border-radius:0px;
            justify-content: center;
            background-color:#06141d;
            border-top:1px solid #27343e;
        }
        .menuWrapper {
            flex:1;
            display:flex;
            justify-content: center;
        }
    }
`;

export default Navbar;
