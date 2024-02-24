import UsersListItem from './UsersListItem';
import styled from 'styled-components';
import {type UserType} from '../features/profile/profileSlice';
import {nanoid} from 'nanoid';
import {useNavigate} from 'react-router-dom';
import {setSearch} from '../features/search/searchSlice';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';

interface UsersListProps {
    data: UserType[],
    search: string
}

const UsersList: React.FunctionComponent<UsersListProps> = ({data, search}) => {
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    console.log(search);
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
                        }} className="direct-search">Search for "{search}"</div>
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
        text-align: center;
        border-bottom: 1px solid black;
    }
    .direct-search {
        cursor: pointer;
        padding: 0.25rem;
    }
    .direct-search:hover, .direct-search:active {
        background-color: lightgray;
    }
`;

export default UsersList;