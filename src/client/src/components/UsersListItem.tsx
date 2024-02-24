import {UserType} from "../features/profile/profileSlice";
import {Link} from 'react-router-dom';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import styled from 'styled-components';

interface UsersListItemProps {
    data: UserType
}

const UsersListItem: React.FunctionComponent<UsersListItemProps> = ({data}) => {
    return (
        <Wrapper>
            <Link to={`/user/${data._id}`}>
                <div className="user-box">
                    <img className="user-pfp" src={data.profilePicture || emptyProfilePicture} alt={data.name}/>
                    <div>{data.name}</div>
                </div>
            </Link>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    padding: 0.25rem;
    a {
        text-decoration: none;
        color: black;
    }
    .user-box {
        cursor: pointer;
        display: flex;
        align-items: center;
        .user-pfp {
            outline: 1px solid black;
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 1rem;
        }
    }
    &:hover, &:active {
        background-color: lightgray;
    }
`;

export default UsersListItem;