import React, {useState} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import {UserType} from '../features/profile/profileSlice';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {updateUser} from '../features/profile/profileThunk';
import { IoClose } from "react-icons/io5";

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

    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              setProfilePicture(reader.result);
            }
          };
          reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (target.profilePicture.files[0]) {
            formData.append('profilePicture', target.profilePicture.files[0]);
        }
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('nickName', (target.elements.namedItem('nickName') as HTMLInputElement).value);
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('dateOfBirth', (target.elements.namedItem('dateOfBirth') as HTMLInputElement).value);
        formData.append('location', (target.elements.namedItem('location') as HTMLInputElement).value);
        formData.append('bio', (target.elements.namedItem('bio') as HTMLInputElement).value);
        formData.append('visibility', (target.elements.namedItem('visibility') as HTMLSelectElement).value);
        console.log(Object.fromEntries(formData));
        dispatch(updateUser(formData));
        toggleIsEditing();
    }
    return (
        <Wrapper>
            <div className="profile-container">
                {isEditing &&
                    <div className="myModal">
                        <div className="modalContainer">
                            
                            <form className="edit-form" onSubmit={handleSubmit}>

                                <div className="modalHeader">
                                    <h1>Edit Profile</h1>
                                    <IoClose onClick={() => { toggleIsEditing(); setProfilePicture(null); }} />
                                </div>
              
                                <div className="userGraphics">
                                    <div className="ugProfilePhoto">
                                        <img src={profilePicture || data!.profilePicture || emptyProfilePicture}/>

                                        <label htmlFor="profile-image" className="piLabel">
                                            Upload
                                        </label>
                                        <input id="profile-image" type="file" name="profilePicture" onChange={handleFileChange}/>
                                    </div>
                                </div>

                                <div className="userDetailList">

                                    <div className="udCombo">
                                        <div className="userDetailItem">
                                            <label htmlFor="nickName">Display Name</label>
                                            <input id="nickName" type="text" name="nickName" defaultValue={data!.nickName} required/>
                                        </div>
                                        <div className="userDetailItem">
                                            <label htmlFor="name">Username</label>
                                            <input id="name" type="text" name="name" defaultValue={data!.name} required/>
                                        </div>
                                    </div>
                                    <div className="udCombo">
                                        <div className="userDetailItem">
                                            <label htmlFor="email">Email Address</label>
                                            <input id="email" type="email" name="email" defaultValue={data!.email} required/>
                                        </div>
                                        <div className="userDetailItem">
                                            <label htmlFor="dateOfBirth">Date of Birth</label>
                                            <input id="dateOfBirth" type="date" name="dateOfBirth" defaultValue={moment(data!.dateOfBirth).utc().format('YYYY-MM-DD')}/>
                                        </div>
                                    </div>
                                  
                                    <div className="udCombo">
                                        <div className="userDetailItem">
                                            <label htmlFor="location">Location</label>
                                            <input id="location" type="text" name="location" defaultValue={data!.location}/>
                                        </div>
                                    </div>
                                    <div className="udCombo">
                                        <div className="userDetailItem">
                                            <label htmlFor="bio">Bio</label>
                                            <textarea id="bio" name="bio" defaultValue={data!.bio}></textarea>
                                        </div>
                                    </div>

                                    <div className="udCombo">
                                        <div className="userDetailItem">
                                            <label htmlFor="visibility">Visibility</label>
                                            <select id="visibility" name="visibility" defaultValue={data!.visibility} required>
                                                <option value="public">Public</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                                {/* <button type="button" onClick={toggleIsEditing}>Cancel</button> */}
                                <button className="submitEdit" type="submit" disabled={updateUserLoading}>{updateUserLoading ? 'Editing' : 'Submit'}</button>
                            </form>
                        </div>
                    </div>
                    }

                    <>
                        <div className="profileHeader">
                            <div className="inner">
                                <img className="coverBanner" src={data!.profilePicture || emptyProfilePicture}/>
                            </div>
                        </div>

                        <div className="profileBody">
                            <div className="inner">
                                <div className="profileBodyBox">
                                    <img className="profile-image" src={data!.profilePicture || emptyProfilePicture}/>
                                    <div className="profileBodyMetaRow">
                                        <div className="profileBodyMeta">
                                            <div className="cWhite f14">{data!.nickName}</div>
                                            <div className="cGray f14">@{data!.name}</div>
                                        </div>
                                        <div className="editProfile" onClick={toggleIsEditing}>Edit Profile</div>
                                    </div>

                                    <div className="profileFollowers">
                                        <div className="followersItem">
                                            <span>{data!.following.length}&nbsp;</span>
                                            <div>Following</div>
                                        </div>
                                        <div className="followersItem">
                                            <span>{data!.followers.length}&nbsp;</span>
                                            <div>Followers</div>
                                        </div>
                                    </div>

                                    <div className="ProfileBodyAdditional">
                                        <div className="cWhite f14">{data!.bio ? data!.bio : 'No Bio Provided'}</div>
                                        {/* <div className="cGray f14">{data!.location ? data!.location : 'No Location Provided'}</div> */}
                                    </div>

                                    {/* <div>{data!.dateOfBirth ? moment(data!.dateOfBirth).utc().format('YYYY-MM-DD') : 'No Date of Birth Provided'}</div>
                                    <div>Visibility: {data!.visibility.toUpperCase()}</div> */}
                           
                                </div>
                            </div>
                        </div>
                    </>
     
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
        .profile-image {
            width: 100px;
            height: 100px;
            border-radius: 12px;
            border: 4px solid #ffffff;
            margin-top: -50px;
            margin-left: 20px;
            object-fit: cover;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.50);
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
    .profileBodyBox {
        background-color:#1c2730;
        .profileBodyWrapper {
            position:relative;
        }
        .profileBodyMetaRow {
            display:flex;
            flex-direction:row;
            align-items:flex-start;
            justify-content: space-between;
            padding:0px 20px 20px 20px;
        }
        .editProfile {
            cursor:pointer;
            font-size:12px;
            color:#1c9be8;
            padding:4px 15px;
            border-radius:6px;
            background-color:#FFFFFF;
            border:0px solid #1c9be8;
        }
        .ProfileBodyAdditional {
            padding:0px 20px 20px 20px;
        }
    }
    .profileHeader .inner {
        display:flex;
        padding-bottom:0px;
        .coverBanner {
            width:100%;
            height:200px;
            border-radius:12px 12px 0px 0px;
            background-color:#eeeeee;
            object-fit:cover;
        }
    }
    .profileBody .inner {
        padding-top:0px;
        .profileBodyBox {
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
        }
    }
    .profileFollowers {
        display:flex;
        flex-direction:row;
        margin-top:-5px;
        margin-bottom:15px;
        padding:0px 20px;
        .followersItem {
            margin-right:20px;
            span {
                font-size:14px;
                color:#FFFFFF;
            }
            div {
                font-size:14px;
                color:#6c7a87;
            }
        }
    }
    .myModal {
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        z-index:999;
        position:fixed;
        display:flex;
        align-items: center;
        justify-content: center;
        background-color:rgba(0,0,0,0.9);
        overflow-y:auto;
        .modalContainer {
            width:600px;
            margin:auto;
            padding:20px;
            border-radius:12px;
            background-color:#06141d;
            .modalHeader {
                display:flex;
                flex-direction:row;
                align-items: center;
                justify-content: space-between;
                padding-bottom:20px;
                color:#FFFFFF;
                h1 {
                    font-weight:500;
                }
                svg {
                    font-size:24px;
                    cursor:pointer;
                }
            }
            .userDetailList {
                padding:10px;
                border-radius:12px;
                background-color:#1c2730;
            }
            .userGraphics {
                display:flex;
                padding:10px;
                margin-bottom:20px;
                border-radius:12px;
                position: relative;
                background-color:#1c2730;
                .ugProfilePhoto {
                    display:flex;
                    width:120px;
                    height:120px;
                    padding:10px;
                    position:relative;
                    img {
                        width:100%;
                        height:100%;
                        margin:0px;
                        object-fit:cover;
                        border-radius:12px;
                    }
                }
                .ugCoverPhoto {
                    flex:1;
                    display:flex;
                    height:150px;
                    padding:10px;
                    position:relative;
                    img {
                        width:100%;
                        height:100%;
                        margin:0px;
                        object-fit:cover;
                        border-radius:12px;
                    }
                }
                #profile-image {
                    display:none;
                }
                .piLabel {
                    top:0px;
                    bottom:0px;
                    left:0px;
                    right:0px;
                    margin:auto;
                    width:80px;
                    height:30px;
                    display:flex;
                    cursor:pointer;
                    font-size:14px;
                    color:#1c9be8;
                    padding:10px 10px;
                    position:absolute;
                    border-radius:8px;
                    align-items: center;
                    justify-content: center;
                    background-color:#FFFFFF;
                    box-shadow:0px 3px 6px rgba(0,0,0,0.20);
                }
            }
            .udCombo {
                display:flex;
                flex-direction:row;
            }
            .userDetailItem {
                flex:1;
                display:flex;
                padding:10px 10px;
                flex-direction:column;
            }
            .userDetailItem label {
                font-size:12px;
                color:#6c7a87;
                margin-top:0px;
                margin-bottom:5px;
            }
            .userDetailItem input , select {
                flex:1;
                width:100%;
                min-height:48px;
                display:flex;
                font-size:14px;
                color:#FFFFFF;
                padding:0px 15px;
                border-width:0px;
                border-radius:12px;
                background-color:rgb(39, 52, 62);
            }
            .userDetailItem textarea {
                flex:1;
                width:100%;
                min-height:80px;
                display:flex;
                font-size:14px;
                color:#FFFFFF;
                padding:15px 15px 0px 15px;
                border-width:0px;
                border-radius:12px;
                background-color:rgb(39, 52, 62);
            }
        }
    }
    @media (max-width:768px) {
        .myModal {
            bottom:78px;
        }
        .myModal .modalContainer {
            margin-left:20px;
            margin-right:20px;
        }
    }
    .edit-form button.submitEdit {
        margin:0px;
        width:initial;
        color:#FFFFFF;
        border-width:0px;
        font-size:14px;
        padding:15px 60px;
        border-radius:12px;
        margin-top:20px;
        cursor:pointer;
        background-color:#1c9be8;
    }
`;

export default ProfileData;