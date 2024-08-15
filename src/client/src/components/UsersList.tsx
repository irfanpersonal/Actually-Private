import UsersListItem from './UsersListItem';
import styled from 'styled-components';
import {type UserType} from '../features/profile/profileSlice';
import {nanoid} from 'nanoid';
import {useNavigate} from 'react-router-dom';
import {setSearch} from '../features/search/searchSlice';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {FaSearch} from 'react-icons/fa';

interface UsersListProps {
    data: UserType[],
    search: string
}

const UsersList: React.FunctionComponent<UsersListProps> = ({data, search}) => {
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    return (
        <Wrapper>
            {!data.length && (
                <div className="no-users">No Users Found!</div>
            )}
            {data.map(item => {
                return (
                    <UsersListItem key={nanoid()} data={item}/>
                );
            })}
            {(data.length > 0 && search || !data.length) && (
                <>
                    {search && (
                        <div onClick={() => {
                            dispatch(setSearch(search));
                            navigate('/search');
                        }} className="direct-search"><FaSearch/> Search for "{search}"</div>
                    )}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.section`
    min-height: 1rem;
    max-height: 10rem;
    overflow: auto;
    .no-users {
        font-size:14px;
        color:#FFFFFF;
        padding-top:20px;
        text-align: left;
    }
    .direct-search {
        display:flex;
        font-size:14px;
        color:#FFFFFF;
        cursor: pointer;
        margin-top:15px;
        padding:10px 15px;
        border-radius:12px;
        align-items:center;
        background-color:#27343e;
        svg {
            font-size:12px;
            margin-right:15px;
        }
    }
    .direct-search:hover, .direct-search:active {
        background-color: #27333d;
    }
`;

export default UsersList;