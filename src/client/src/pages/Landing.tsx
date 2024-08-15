import React from 'react';
import styled from 'styled-components';
import {Link, useLocation} from 'react-router-dom';
import {FaComment, FaHeart, FaUserFriends, FaPen, FaBan} from 'react-icons/fa';
import homeIco from '../images/home.png';
import trioOne from '../images/trioOne.png';
import trioTwo from '../images/trioTwo.png';
import trioThree from '../images/trioThree.png';

const Landing: React.FunctionComponent = () => {
    return (
        <Wrapper>
            <div className="header">
                <div className="logo nUnderline">AP</div>
                <Link to='/auth'><div className="myAccount">Account</div></Link>
            </div>

            <div className="container">
                <div className="section row homeCombo">
                    <div className="half">
                        <div className="pad20">
                            <h1 className="cWhite semiBold">Welcome to ActuallyPrivate</h1>
                            <div className="cGray topAdjust">A deliberately dark-themed social media network.</div>
                            <div className="landAction">
                                <Link to='/auth'><div className="lightButton">Login Now</div></Link>
                                <Link to='/auth' state={{ wantsToRegister: true }}><div className="darkButton">Create Account</div></Link>
                            </div>
                        </div>
                    </div>
                    <div className="half hideMobile">
                        <div className="pad20">
                            <img src={homeIco} className="homeDecor"/>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <div className="pad20">
                        <h1 className="title semiBold cWhite tCenter">Explore our interactive features.</h1>
                        <p className="cGray f14 tCenter topAdjust">Connect with friends, share posts, and explore trending topics while keeping your privacy intact.</p>
                    </div>

                    <div className="feature-container">
                        <div className="featureUnit">
                            <div className="feature-item">
                                <div className="feature-icon"><FaPen/></div>
                                <div className="featureContext">
                                    <div className="feature-title">Create Posts</div>
                                    <div className="feature-text">
                                        Easily create and share your thoughts, photos, and updates with your followers.
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div className="featureUnit">
                            <div className="feature-item">
                                <div className="feature-icon"><FaUserFriends /></div>
                                <div className="featureContext">
                                    <div className="feature-title">Follow Users</div>
                                    <div className="feature-text">
                                        Follow your favorite users and stay updated with their latest posts and activities.
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="featureUnit">
                            <div className="feature-item">
                                <div className="feature-icon"><FaHeart /></div>
                                <div className="featureContext">
                                    <div className="feature-title">Like Posts</div>
                                    <div className="feature-text">
                                        Show appreciation by liking posts that resonate with you.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="featureUnit">
                            <div className="feature-item">
                                <div className="feature-icon"><FaComment /></div>
                                <div className="featureContext">
                                    <div className="feature-title">Comment on Posts</div>
                                    <div className="feature-text">
                                        Engage with the community by leaving comments and starting conversations.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="featureUnit">
                            <div className="feature-item">
                                <div className="feature-icon"><FaBan /></div>
                                <div className="featureContext">
                                    <div className="feature-title">Block Users</div>
                                    <div className="feature-text">
                                        Maintain a positive experience by blocking unwanted users from interacting with you.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section adjust">
                    <div className="pad20">
                        <h1 className="title semiBold cWhite">The platform for anonymity.</h1>
                        <p className="cGray f14 topAdjust">Connect with friends, share posts, and explore trending topics while keeping your privacy intact.</p>
                    </div>

                    <div className="homeTrio">
                        <div className="trioItem">
                            <img src={trioOne}/>
                            <div>All Platform</div>
                            <span>ActuallyPrivate works seamlessly and securely on all web, and mobile devices.</span>
                        </div>
                        <div className="trioItem">
                            <img src={trioTwo}/>
                            <div>Explore Trends</div>
                            <span>See whats trending and contribute to a wide diverse array of topics and subjects.</span>
                        </div>
                        <div className="trioItem">
                            <img src={trioThree}/>
                            <div>Dark Theme</div>
                            <span>This dark theme was developed to provide a fun all-time night-time experience.</span>
                        </div>
                    </div>
                </div>
            </div>
            
            
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin: 0 auto;
    padding: 10px;
    .header {
        padding:20px;
        display:flex;
        align-items:center;
        justify-content: space-between;
        a {
            color:initial;
            text-decoration:none;
        }
        .logo {
            user-select: none;
            color: #FFFFFF;
            font-weight: 600;
            font-size: 18px;
            margin-right: 20px;
            text-decoration: none;
        }
        .myAccount {
            font-size:14px;
            color:#FFFFFF;
            cursor: pointer;
            position: relative;
            user-select: none;
            padding: 5px 20px;
            border-radius: 999px;
            background-color: rgb(28, 39, 48);
        }
        .myAccount:hover {
            background-color: rgb(19 32 41);
        }
    }
    .container {
        padding:0px;
        flex-direction:column;
    }
    .section {
        padding:100px 0px 100px 0px;
    }
    .adjust {
        padding-bottom:200px;
    }
    .section.row {
        align-items:center;
    }
    .feature-container {
        padding:10px;
        margin-top:20px;
        .featureUnit {
            padding:10px;
        }
        .feature-item {
            display:flex;
            padding:20px;
            border-radius:12px;
            align-items:center;
            background-color:#1c2730;
            .feature-title {
                font-size:14px;
                color:#FFFFFF;
            }
            .feature-icon {
                min-width:40px;
                min-height:40px;
                display:flex;
                border-radius:999px;
                align-items: center;
                justify-content: center;
                background-color:#6c7a87;
            }
            .featureContext {
                padding-left:15px;
            }
            .feature-text {
                font-size:14px;
                color:#6c7a87;
            }
            svg {
                color:#FFFFFF;
            }
        }
    }
    .landAction {
        gap:20px;
        display:flex;
        flex-direction:row;
        padding:40px 0px;
        a {
            text-decoration:none;
        }
    }
    .lightButton {
        cursor:pointer;
        color:#FFFFFF;
        padding:15px 30px;
        border-radius:12px;
        background-color:#1c9be8;
    }
    .lightButton:hover {
        opacity:0.7;
    }
    .darkButton {
        cursor:pointer;
        color:#FFFFFF;
        padding:15px 30px;
        border-radius:12px;
        background-color:rgb(39, 52, 62);
    }
    .darkButton:hover {
        opacity:0.7;
    }
    .homeDecor {
        width:100%;
        height:400px;
        object-fit:contain;
        border-radius:20px;
    }
    .topAdjust {
        margin-top:10px;
    }
    .homeTrio {
        gap:20px;
        display:flex;
        padding:20px;
        .trioItem {
            flex:1;
            display: flex;
            padding: 20px;
            border-radius: 12px;
            align-items: center;
            flex-direction:column;
            background-color: #1c2730;
            img {
                margin:auto;
                width:100%;
                height:200px;
                max-width:50%;
                object-fit:contain;
            }
            div {
                font-size:14px;
                color:#FFFFFF;
                padding:10px 0px;
                text-align:center;
            }
            span {
                font-size:14px;
                color:#6c7a87;
                text-align:center;
            }
        }
    }
    @media (max-width:768px) {
        .homeCombo , .homeTrio {
            flex-direction:column;
        }
        .hideMobile {
            display:none;
        }
        .section {
            padding-bottom:0px;
        }
    }
`;

export default Landing;