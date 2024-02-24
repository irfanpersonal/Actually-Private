import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import {UserType} from '../features/profile/profileSlice';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {updateUser} from '../features/profile/profileThunk';

interface ProfileDataProps {
    data: UserType
}

const ProfileData: React.FunctionComponent<ProfileDataProps> = ({data}) => {
    const dispatch = useDispatch<useDispatchType>();
    const {updateUserLoading} = useSelector((store: useSelectorType) => store.profile);
    const [isEditing, setIsEditing] = React.useState(false);
    const toggleIsEditing = () => {
        setIsEditing(currentState => {
            return !currentState;
        });
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (target.profilePicture.files[0]) {
            formData.append('profilePicture', target.profilePicture.files[0]);
        }
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('dateOfBirth', (target.elements.namedItem('dateOfBirth') as HTMLInputElement).value);
        formData.append('location', (target.elements.namedItem('location') as HTMLInputElement).value);
        formData.append('bio', (target.elements.namedItem('bio') as HTMLInputElement).value);
        formData.append('visibility', (target.elements.namedItem('visibility') as HTMLSelectElement).value);
        console.log(Object.fromEntries(formData));
        dispatch(updateUser(formData));
    }
    return (
        <Wrapper>
            <div className="profile-container">
                {isEditing ? (
                    <form className="edit-form" onSubmit={handleSubmit}>
                        <div>
                            <label>Current Profile Picture</label>
                            <img className="profile-image" src={data!.profilePicture || emptyProfilePicture}/>
                            <input id="profile-image" type="file" name="profilePicture"/>
                        </div>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" name="name" defaultValue={data!.name} required/>
                        </div>
                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input id="email" type="email" name="email" defaultValue={data!.email} required/>
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth">Date of Birth</label>
                            <input id="dateOfBirth" type="date" name="dateOfBirth" defaultValue={moment(data!.dateOfBirth).utc().format('YYYY-MM-DD')} required/>
                        </div>
                        <div>
                            <label htmlFor="location">Location</label>
                            <input id="location" type="text" name="location" defaultValue={data!.location} required/>
                        </div>
                        <div>
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio" name="bio" defaultValue={data!.bio} required></textarea>
                        </div>
                        <div>
                            <label htmlFor="visibility">Visibility</label>
                            <select id="visibility" name="visibility" defaultValue={data!.visibility} required>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                        <button type="button" onClick={toggleIsEditing}>Cancel</button>
                        <button type="submit" disabled={updateUserLoading}>{updateUserLoading ? 'Editing' : 'Edit'}</button>
                    </form>
                ) : (
                    <>
                        <img className="profile-image" src={data!.profilePicture || emptyProfilePicture}/>
                        <div>{data!.name}</div>
                        <div>{data!.bio ? data!.bio : 'No Bio Provided'}</div>
                        <div>{data!.location ? data!.location : 'No Location Provided'}</div>
                        <div>{data!.dateOfBirth ? moment(data!.dateOfBirth).utc().format('YYYY-MM-DD') : 'No Date of Birth Provided'}</div>
                        <div>Visibility: {data!.visibility.toUpperCase()}</div>
                        <div className="connection-container">
                            <div className="connection-box">
                                <div className="connection-box-title">Following</div>
                                <div>{data!.following.length}</div>
                            </div>
                            <div className="connection-box">
                                <div className="connection-box-title">Followers</div>
                                <div>{data!.followers.length}</div>
                            </div>
                        </div>  
                        <button onClick={toggleIsEditing} type="button" className="edit-btn" disabled={updateUserLoading}>Edit</button>
                    </>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .edit-form {
        label {
            margin-top: 0.25rem;
            display: block;
        }
        img {
            display: block;
            margin: 0.5rem auto;
        }
        input[type="file"] {
            outline: 1px solid black;
            padding: 0.25rem;
            border-radius: 0.25rem;
        }
        label + input, textarea, select, button {
            width: 50%;
            padding: 0.25rem;
        }
        textarea {
            resize: none;
            height: 120px;
        }
        button {
            display: block;
            margin: 0 auto;
            margin-top: 1rem;
        }
    }
    .profile-container {
        background-color: lightgray;
        outline: 1px solid black;
        text-align: center;
        padding: 1rem;
        margin-bottom: 1rem;
        .profile-image {
            width: 5rem;
            height: 5rem;
            outline: 1px solid black;
        }
        .connection-container {
            margin-top: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .connection-box {
                cursor: pointer;
                user-select: none;
                .connection-box-title {
                    border-bottom: 1px solid black;
                }
                outline: 1px solid black;
                padding: 0.5rem;
                margin-right: 0.5rem;
            }
        }
        .edit-btn {
            width: 25%;
            margin-top: 1rem;
            padding: 0.25rem;
            user-select: none;
        }
    }
`;

export default ProfileData;