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
            <div className="title">Stats Data</div>
            {getStatsLoading ? (
                <Loading title='Loading Stats' position='normal' marginTop='1rem'/>
            ) : (
                <div>
                    <h2 style={{marginTop: '1rem', textAlign: 'center'}}>Welcome to the Admin Panel!</h2>
                    <p className="intro-talk">Here, you'll find all the important numbers about what's happening on our platform. We'll tell you how many users we have, how many posts they've made, how many people want to follow them, and how many comments they've left. You can also see who the most popular users are and which posts everyone likes the most. </p>
                    {statsData ? (
                        <div>
                            <h3 className="data-box"><FaUser/>User Count: {statsData.userCount}</h3>
                            <h3 className="data-box"><FaEdit/>Post Count: {statsData.postCount}</h3>
                            <h3 className="data-box"><FaComment/>Comment Count: {statsData.commentCount}</h3>
                            <h3 className="data-box"><MdPending/>Follow Request Count: {statsData.followRequestCount}</h3>
                            <h3 className="subtitle">Most Followed Users</h3>
                            <div className="center">
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
                            <h3 className="subtitle">Most Liked Posts</h3>
                            <div className="center">
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
                        <div className="title">Not Enough/Any Data</div>
                    )}
                    <div onClick={() => {
                        if (logoutLoading) {
                            return;
                        }
                        dispatch(logoutUser());
                    }} className="logout">{logoutLoading ? 'Logging Out' : 'Logout'}</div>
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding: 0.5rem;
    .title {
        background-color: black;
        color: white;
        text-align: center;
        padding: 0.5rem;
    }
    .intro-talk {
        padding: 0.5rem;
        background-color: lightgray;
        margin-top: 1rem;
    }
    .data-box {
        outline: 1px solid black;
        padding: 0.5rem;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        svg {
            margin-right: 0.5rem;
        }
    }
    .subtitle {
        border-bottom: 1px solid black;
        text-align: center;
        margin: 1rem 0;
    }
    .center {
        padding: 1rem;
        outline: 1px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .logout {
        cursor: pointer;
        outline: 1px solid black;
        padding: 0.5rem;
        text-align: center;
        margin-top: 1rem;
    }
    .logout:active, .logout:hover {
        background-color: black;
        color: white;
    }
`;

export default Admin;