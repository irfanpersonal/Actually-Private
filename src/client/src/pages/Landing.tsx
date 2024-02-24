import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {FaComment, FaHeart, FaUserFriends, FaPen, FaBan} from 'react-icons/fa';

const Landing: React.FunctionComponent = () => {
    return (
        <Wrapper>
            <div className="intro-box">
                <h1 className="title">Welcome to Actually Private</h1>
                <p className="description">Connect with friends, share posts, and explore trending topics while keeping your privacy intact.</p>
                <Link to='/auth'>Get Started</Link>
            </div>
            <div className="feature-container">
                <div className="feature-item">
                    <div className="feature-icon"><FaPen/></div>
                    <div className="feature-title">Create Posts</div>
                    <div className="feature-text">
                        Easily create and share your thoughts, photos, and updates with your followers.
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon"><FaUserFriends /></div>
                    <div className="feature-title">Follow Users</div>
                    <div className="feature-text">
                        Follow your favorite users and stay updated with their latest posts and activities.
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon"><FaHeart /></div>
                    <div className="feature-title">Like Posts</div>
                    <div className="feature-text">
                        Show appreciation by liking posts that resonate with you.
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon"><FaComment /></div>
                    <div className="feature-title">Comment on Posts</div>
                    <div className="feature-text">
                        Engage with the community by leaving comments and starting conversations.
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon"><FaBan /></div>
                    <div className="feature-title">Block Users</div>
                    <div className="feature-text">
                        Maintain a positive experience by blocking unwanted users from interacting with you.
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin: 0 auto;
    padding: 1rem;
    .intro-box {
        text-align: center;
        margin-bottom: 3rem;
        .title {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
        }
        .description {
            font-size: 1.15rem;
            margin-bottom: 2rem;
        }
    }
    a {
        text-decoration: none;
        background-color: limegreen;
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 0.25rem;
        font-size: 1.25rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        &:hover {
            background-color: green;
        }
    }
    .feature-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .feature-item {
            width: 300px;
            text-align: center;
            margin: 0 20px 40px;
            padding: 1rem;
            background-color: lightgray;
            border-radius: 1rem;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            .feature-icon {
                font-size: 3rem;
                margin-bottom: 0.75rem;
            }
            .feature-title {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
            }
            .feature-text {
                color: gray;
            }
        }
    }
`;

export default Landing;