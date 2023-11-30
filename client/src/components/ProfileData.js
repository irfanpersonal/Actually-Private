import {useDispatch, useSelector} from "react-redux";
import {FiFileText, FiBriefcase} from "react-icons/fi";
import {isEditingTrue} from '../features/profile/profileSlice.js';
import {followUser, unfollowUser} from "../features/otherProfile/otherProfileThunk.js";
import {setData, showModalTrue, setTitle, resetModalData} from "../features/modal/modalSlice.js";

const ProfileData = ({data: user, otherProfile}) => {
    const {user: loggedInUser} = useSelector(store => store.user);
    const {profileData} = useSelector(store => store.otherProfile);
    const dispatch = useDispatch();
    return (
        <div className="container">
            {user.profilePicture ? (
                <img style={{display: 'block', margin: '0 auto', marginBottom: '1rem', border: '1px solid black', borderRadius: '50%'}} src={user.profilePicture} alt={user.name}/>
            ) : (
                <h1 style={{textAlign: 'center'}}>No Profile Picture</h1>
            )}
            <h1 style={{textAlign: 'center'}}>{user.name}</h1>
            <h1 style={{textAlign: 'center'}}><span onClick={() => {
                dispatch(resetModalData());
                dispatch(showModalTrue());
                dispatch(setTitle('Following'));
                if (otherProfile) {
                    dispatch(setData(profileData.following));
                    return;
                }
                dispatch(setData(user.following));
            }} style={{textDecoration: 'underline', cursor: 'pointer'}}>Following: {user.following.length}</span> <span onClick={() => {
                dispatch(resetModalData());
                dispatch(showModalTrue());
                dispatch(setTitle('Followers'));
                if (otherProfile) {
                    dispatch(setData(profileData.followers));
                    return;
                }
                dispatch(setData(user.followers));
            }} style={{textDecoration: 'underline', cursor: 'pointer'}}>Followers: {user.followers.length}</span></h1>
            {otherProfile && loggedInUser && (
                <button onClick={() => {
                    if (profileData.followers.some(follower => follower._id === loggedInUser?.userID)) {
                        dispatch(unfollowUser(profileData._id));
                        return;
                    }                      
                    dispatch(followUser(profileData._id));
                }}>{profileData.followers.some(follower => follower._id === loggedInUser?.userID) ? 'Following' : 'Follow'}</button>
            )}
            {user.bio ? (
                <p><FiFileText style={{marginRight: '1rem'}}/> {user.bio}</p>
            ) : (
                <h1 style={{textAlign: 'center'}}>No Profile Bio</h1>
            )}
            {user.location ? (
                <p><FiBriefcase style={{marginRight: '1rem'}}/> {user.location}</p>
            ) : (
                <h1 style={{textAlign: 'center'}}>No Profile Location</h1>
            )}
            {!otherProfile && (
                <button type="button" onClick={() => dispatch(isEditingTrue())}>EDIT</button>
            )}
        </div>
    );
}

export default ProfileData;