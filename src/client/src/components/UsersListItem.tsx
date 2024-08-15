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
    padding: 20px 0px 0px 0px;
    a {
        text-decoration: none;
        color: black;
    }
    .user-box {
        cursor: pointer;
        display: flex;
        align-items: center;
        .user-pfp {
            width: 30px;
            height: 30px;
            border-radius:999px;
            object-fit:cover;
        }
        div {
            font-size:14px;
            color:#FFFFFF;
            margin-left:10px;
            text-transform:capitalize;
        }
    }
    &:hover, &:active {
    }
`;

export default UsersListItem;