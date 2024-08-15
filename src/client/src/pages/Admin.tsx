import React from 'react';
import styled from 'styled-components';
import {Loading} from '../components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getStats} from '../features/admin/adminThunk';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell} from 'recharts';
import {FaUser, FaEdit, FaComment} from "react-icons/fa";
import {MdPending} from "react-icons/md";
import {logoutUser} from '../features/user/userThunk';

const Admin: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {getStatsLoading, statsData} = useSelector((store: useSelectorType) => store.admin);
    const {logoutLoading} = useSelector((store: useSelectorType) => store.user);
    React.useEffect(() => {
        dispatch(getStats());
    }, []);
    return (
        <Wrapper>
            <div className="header">
                <div className="logo nUnderline">AP</div>
                <div className="myAccount" onClick={() => { if (logoutLoading) { return; } dispatch(logoutUser()); }}>Logout</div>
            </div>

            {getStatsLoading ? (
                <Loading title='Loading Stats' position='normal' marginTop='1rem'/>
            ) : (
                <div className="pad20">
                    <div className="adminheader">
                        <h1 style={{}}>Welcome to the Admin Panel!</h1>
                        <p>Here, you'll find all the important numbers about what's happening on our platform. We'll tell you how many users we have, how many posts they've made, how many people want to follow them, and how many comments they've left. You can also see who the most popular users are and which posts everyone likes the most. </p>
                    </div>
                    
                    {statsData ? (
                        <div>
                            <div className="statBox">
                                <div className="data-box">
                                    <div className="statInner">
                                        <FaUser/>
                                        <div>User Count</div>
                                    </div>
                                    <span>{statsData.userCount}</span>
                                </div>

                                <div className="data-box">
                                    <div className="statInner">
                                        <FaEdit/>
                                        <div>Post Count</div>
                                    </div>
                                    <span>{statsData.postCount}</span>
                                </div>

                                <div className="data-box">
                                    <div className="statInner">
                                        <FaComment/>
                                        <div>Comment Count</div>
                                    </div>
                                    <span>{statsData.commentCount}</span>
                                </div>

                                <div className="data-box">
                                    <div className="statInner">
                                        <MdPending/>
                                        <div>Follow Request Count</div>
                                    </div>
                                    <span>{statsData.followRequestCount}</span>
                                </div>
                            </div>
                            
                            <div className="chartBox">
                                <h3 className="subtitle">Most Followed Users</h3>
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={statsData.mostFollowedUsers}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Follow Count" fill="black" />
                                </BarChart>
                            </div>
                            
                            <div className="chartBox">
                                <h3 className="subtitle">Most Liked Posts</h3>
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={statsData.mostLikedPosts}
                                        dataKey="likeCount"
                                        fill="black"
                                    >
                                    </Pie>
                                    <Tooltip formatter={(value, index, array) => (
                                        <div>
                                            <div className="">User: {array.payload.user}</div>
                                            <div className="">Post ID: {array.payload._id}</div>
                                            <div className="">Like Count: {value}</div>
                                        </div>
                                    )}/>
                                </PieChart>
                            </div>
                        </div>
                    ) : (
                        <div className="notEnough">Not Enough/Any Data</div>
                    )}
                </div>
            )}
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
    }
    .adminheader {
        padding:20px;
        margin-top:0px;
        border-radius:12px;
        background-color:rgb(28, 39, 48);
        h1 {
            font-size:18px;
            color:#FFFFFF;
            font-weight:500;
        }
        p {
            font-size:14px;
            color:#6c7a87;
            margin-top:10px;
        }
    }
    .statBox {
        gap:20px;
        display:flex;
        flex-direction:row;
        margin-top:20px;
        .data-box {
            flex:1;
            display:flex;
            padding:20px;
            margin-top:0px;
            border-radius:12px;
            flex-direction:column;
            background-color:rgb(28, 39, 48);
            .statInner {
                display:flex;
                flex-direction:row;
                align-items:center;
                svg {
                    color:#6c7a87;
                    margin-right:15px;
                }
                div {
                    font-size:14px;
                    color:#6c7a87;
                }
            }
            span {
                font-size:18px;
                font-weight:500;
                color:#FFFFFF;
                margin-top:10px;
            }
            
        }
    }
    .chartBox {
        flex: 1;
        display: flex;
        padding: 20px;
        margin-top: 20px;
        border-radius: 12px;
        flex-direction: column;
        background-color: rgb(28, 39, 48);
        h3 {
            font-size:18px;
            font-weight:500;
            color:#FFFFFF;
            margin-bottom:40px;
        }
        * {
            margin:auto;
            max-width:100%;
        }
    }
    .notEnough {
        display: flex;
        padding: 20px;
        font-size:14px;
        color:#FFFFFF;
        margin-top: 20px;
        border-radius: 12px;
        flex-direction: column;
        background-color: rgb(28, 39, 48);
    }
    @media (max-width:768px) {
        .statBox {
            flex-direction:column;
        }
        .pad20 {
            padding:5px 15px 15px 15px;
        }
    }
`;

export default Admin;