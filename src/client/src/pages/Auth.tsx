import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {toggleAuthType} from '../features/user/userSlice';
import {RegisterBox, LoginBox} from '../components';
import {loginUser, registerUser} from '../features/user/userThunk';
import {useNavigate} from 'react-router-dom';

const Auth: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user, authLoading} = useSelector((store: useSelectorType) => store.user);
    const navigate = useNavigate();
    const {wantsToRegister} = useSelector((store: useSelectorType) => store.user);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (wantsToRegister) {
            formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
            formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
            formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
            dispatch(registerUser(formData));
            return;
        }
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
        dispatch(loginUser(formData));
    }
    React.useEffect(() => {
        if (user) {
            navigate('/'); 
        }
    }, [user]);
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="auth-title">{wantsToRegister ? 'Register' : 'Login'}</div>
                {wantsToRegister ? (
                    <RegisterBox/>
                ) : (
                    <LoginBox/>
                )}
                <p onClick={() => dispatch(toggleAuthType())}>{wantsToRegister ? 'Have an account?' : `Don't have an account?`}</p>
                <button type="submit" disabled={authLoading}>{authLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    form {
        background-color: lightgray;
        padding: 1rem;
        width: 50%;
        .auth-title {
            background-color: black;
            color: white;
            padding: 0.25rem;
            text-align: center;
            margin-bottom: 0.5rem;
        }
        label {
            display: block;
            margin-bottom: 0.25rem;
        }
        input, textarea, button {
            width: 100%;
            padding: 0.25rem;
        }
        input, textarea {
            margin-bottom: 0.5rem;
        }
        textarea {
            resize: none;
            height: 120px;
        }
        p {
            cursor: pointer;
            text-align: center;
            margin-bottom: 0.25rem;
        }
        p:hover, p:active {
            color: gray;
        }
    }
`;

export default Auth;