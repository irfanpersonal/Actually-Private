import styled from 'styled-components';
import {MdOutlinePrivateConnectivity} from "react-icons/md";

interface LoadingProps {
    title: string;
    position: 'normal' | 'center';
    marginTop?: string;
}

const Loading: React.FunctionComponent<LoadingProps> = ({ title, position, marginTop }) => {
    return (
        <Wrapper style={{justifyContent: position === 'center' ? 'center' : 'flex-start', marginTop: marginTop}}>
            <div className="loading">
                <MdOutlinePrivateConnectivity className="icon" />
            </div>
            <h1>{title}</h1>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0.5rem solid black;
        border-radius: 50%;
        width: 3.75rem;
        height: 3.75rem;
        animation: spinner 1.5s infinite alternate;
        background-color: white;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    }
    .icon {
        color: black;
        font-size: 2rem;
    }
    h1 {
        margin-top: 1rem;
        font-size: 1.5rem;
        color: #333; 
    }
    @keyframes spinner {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

export default Loading;