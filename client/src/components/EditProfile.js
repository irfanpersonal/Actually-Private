import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {isEditingFalse} from '../features/profile/profileSlice';
import React from 'react';
import {updateUser} from '../features/user/userThunk';

const EditProfile = () => {
    const dispatch = useDispatch();
    const {user, profileEditing} = useSelector(store => store.user);
    const [input, setInput] = React.useState({
        profilePicture: '',
        name: user.name,
        bio: user.bio,
        location: user.location
    });
    const handleChange = (event) => {
        setInput(currentState => {
            return {...currentState, [event.target.name]: event.target.value};
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', event.target.elements.name.value);
        formData.append('bio', event.target.elements.bio.value);
        formData.append('location', event.target.elements.location.value);
        formData.append('profilePicture', event.target.profilePicture.files[0]);
        dispatch(updateUser(formData));
    }
    return (
        <div className="container">
            <Wrapper onSubmit={handleSubmit}>
                <h2>Current Profile Picture: {user.profilePicture ? <img style={{width: '50px', height: '50px', display: 'block'}} src={user.profilePicture}/> : 'None'}</h2>
                <div>
                    <label htmlFor="profilePicture" style={{marginTop: '1rem'}}>Profile Picture</label>
                    <input style={{padding: 'none', margin: 'none'}} id="profilePicture" type="file" name="profilePicture"/>
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" style={{padding: '0.5rem'}} name="name" value={input.name} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="bio">Bio</label>
                    <input id="bio" type="text" style={{padding: '0.5rem'}} name="bio" value={input.bio} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="location">Location</label>
                    <input id="location" type="location" style={{padding: '0.5rem'}} name="location" value={input.location} onChange={handleChange}/>
                </div>
                <button type="button" style={{marginBottom: '1rem'}} onClick={() => dispatch(isEditingFalse())}>BACK</button>
                <button type="submit">{profileEditing ? 'EDITING' : 'EDIT'}</button>
            </Wrapper>
        </div>
    );
}

const Wrapper = styled.form`
    label {
        display: block;
    }
    input {
        width: 100%;
        margin-bottom: 1rem;
    }
`;

export default EditProfile;