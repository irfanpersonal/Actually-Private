import {redirect} from "react-router-dom";
import axios from 'axios';
import {setProfileData, setProfilePosts} from "../features/otherProfile/otherProfileSlice";
import {useSelector} from "react-redux";
import {ProfileData, PostList} from "../components";
import styled from 'styled-components';
import {Modal} from '../components';

export const loader = (store) => async({context, params, request}) => {
    try {
        const {id} = params;
        const response = await axios.get(`/api/v1/users/${id}`);
        const data = response.data;
        const getPostsFromUser = await axios.get(`/api/v1/posts/getPostsFromUser/${id}`);
        const getPostsFromUserData = getPostsFromUser.data;
        store.dispatch(setProfileData(data.user));
        store.dispatch(setProfilePosts(getPostsFromUserData.posts));
        if (store.getState()?.user?.user?.name === data?.user?.name) {
            return redirect('/profile');
        }
        return data.user;
    }
    catch(error) {
        console.log(error);
        return redirect('/');
    }
}

const Profile = () => {
    const {profileData, profilePosts} = useSelector(store => store.otherProfile);
    const {showModal} = useSelector(store => store.modal);
    return (
        <Wrapper>
            <ProfileData data={profileData} otherProfile/>
            <PostList data={profilePosts} title="Posts"/>
            {showModal && <Modal/>}
        </Wrapper>
    );
}

const Wrapper = styled.div` 
    button > a {
        text-decoration: none;
        color: black;
        font-size: 1rem;
    }
    button {
        width: 100%;
        padding: 0.5rem;
        border: none;
        background-color: lightcoral;
    }
    button:hover {
        outline: 1px solid black;
    }
    button:active {
        background-color: white;
    }
    .container {
        border: 1px solid black;
        padding: 1rem;
        margin: 1rem 0;
    }
    img {
        width: 50px;
        height: 50px;
    }
    p {
        background-color: lightgray;
        padding: 1rem;
        margin: 1rem 0;
    }
`;

export default Profile;