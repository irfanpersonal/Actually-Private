import React, {useState} from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useDispatchType, useSelectorType } from '../store';
import { toggleAuthType } from '../features/user/userSlice';
import { RegisterBox, LoginBox } from '../components';
import { loginUser, registerUser } from '../features/user/userThunk';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Auth: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const { user, authLoading } = useSelector((store: useSelectorType) => store.user);
    const navigate = useNavigate();
    const location = useLocation();

    // Access wantsToRegister from location state or default to false
    const [wantsToRegister, setWantsToRegister] = useState(location.state?.wantsToRegister || false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (wantsToRegister) {
            formData.append('nickName', (target.elements.namedItem('nickName') as HTMLInputElement).value);
            formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
            formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
            formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
            dispatch(registerUser(formData));
            return;
        }
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
        dispatch(loginUser(formData));
    };

    const handleToggleAuthType = () => {
        setWantsToRegister(!wantsToRegister); // Toggle wantsToRegister locally
    };

    React.useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <Wrapper className="auth">
            <div className="header">
                <Link to='/' className="logo nUnderline">AP</Link>
                <Link to='/'><div className="myAccount">Home</div></Link>
            </div>
            <div className="authBody">
                <form onSubmit={handleSubmit}>
                    <div className="auth-title">{wantsToRegister ? 'Register' : 'Login'}</div>
                    {wantsToRegister ? (
                        <RegisterBox />
                    ) : (
                        <LoginBox />
                    )}
                    <div className="actionRow">
                        <p onClick={handleToggleAuthType}>{wantsToRegister ? 'Have an account?' : `Don't have an account?`}</p>
                        <button type="submit" disabled={authLoading}>{authLoading ? 'Submitting' : 'Submit'}</button>
                    </div>

                </form>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction:column;
    padding:10px;
    .header {
        padding:20px;
        display:flex;
        align-items:center;
        justify-content: space-between;
        .logo {
            user-select: none;
            color: #FFFFFF;
            font-weight: 600;
            font-size: 18px;
            margin-right: 20px;
            text-decoration: none;
        }
        .logo:hover {
            opacity:0.7;
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
    .authBody {
        flex:1;
        display:flex;
        align-items: center;
        justify-content: center;
    }
    form {
        width:400px;
        margin:20px;
        display:flex;
        padding:10px;
        max-width:100%;
        border-radius: 12px;
        flex-direction:column;
        background-color: rgb(28, 39, 48);
        div {
            padding:10px;
        }
        .auth-title {
            color:#FFFFFF;
            font-size:18px;
            font-weight:500;
        }
        label {
            font-size:14px;
            display: block;
            color: #6c7a87;
            margin-bottom:10px;
        }
        input {
            color:#FFFFFF;
        }
        input, textarea, button {
            width: 100%;
            font-size:14px;
            border-width:0px;
            padding:10px 15px;
            border-radius:12px;
            background-color:rgb(39, 52, 62);
        }
        input::placeholder {
            color:#6c7a87;
        }
        input, textarea {
            margin-bottom: 8px;
        }
        textarea {
            resize: none;
            height: 120px;
        }
        p {
            font-size:14px;
            color:#FFFFFF;
            cursor: pointer;
            text-align: center;
            margin-bottom:20px;
        }
        p:hover, p:active {
            color: gray;
        }
        button {
            flex:1;
            color:#FFFFFF;
            cursor:pointer;
            background-color:#1c9be8;
        }
        button:hover {
            opacity:0.7;
        }
        .actionRow {
            display:flex;
            flex-direction:column;
            padding:0px 10px 10px 10px;
            button {

            }
        }
    }
`;

export default Auth;