import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {loginUser, registerUser} from '../features/user/userThunk';
import {toggleWantsToRegister} from '../features/user/userSlice';
import {useNavigate} from 'react-router-dom';

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {wantsToRegister, user, isLoading} = useSelector(store => store.user);
    const [input, setInput] = React.useState({
        name: '',
        email: '',
        password: ''
    });
    const handleChange = (event) => {
        setInput(currentState => {
            return {...currentState, [event.target.name]: event.target.value};
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (wantsToRegister) {
            dispatch(registerUser(input));
            return;
        }
        dispatch(loginUser({email: input.email, password: input.password}));
    }
    React.useEffect(() => {
        if (user) {
            navigate('/');
        }   
    }, [user]);
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1>{wantsToRegister ? 'Register' : 'Login'}</h1>
                {wantsToRegister && (
                    <div>
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" name="name" value={input.name} onChange={handleChange}/>
                    </div>
                )}
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" value={input.email} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" value={input.password} onChange={handleChange}/>
                </div>
                <p>{wantsToRegister ? `Already have an account` : `Don't have an account`}<span onClick={() => dispatch(toggleWantsToRegister())}>{wantsToRegister ? 'LOGIN' : 'REGISTER'}</span></p>
                <button type="submit">{isLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    form {
        width: 50%;
        border: 1px solid black;
        margin: 0 auto;
        padding: 1rem;
    }
    form > h1 {
        text-align: center;
        background-color: lightblue;
    }
    div > label {
        display: block;
        margin-top: 1rem;
    }
    label + input {
        width: 100%;
        padding: 0.5rem;
    }
    div + p {
        margin: 1rem 0;
        text-align: center;
    }
    p > span {
        background-color: lightgreen;
        padding: 0.5rem 2rem;
        border-radius: 2rem;
        margin-left: 0.5rem;
    }
    p + button {
        padding: 0.5rem;
        width: 100%;
    }
`;

export default Auth;