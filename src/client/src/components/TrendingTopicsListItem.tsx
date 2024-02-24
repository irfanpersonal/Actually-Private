import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {setSearch} from '../features/search/searchSlice';

interface TrendingTopicsListItemProps {
    data: string,
    index: number
}

const TrendingTopicsListItem: React.FunctionComponent<TrendingTopicsListItemProps> = ({data, index}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <Wrapper>
            <div onClick={() => {
                navigate('/search');
                dispatch(setSearch(data));
            }} className="topic">{index + 1}. {data}</div>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    .topic {
        outline: 1px solid black;
        padding: 1rem;
        margin: 1rem 0;
        cursor: pointer;
    }
    .topic:hover, .topic:active {
        background-color: lightgray;
    }
`;

export default TrendingTopicsListItem;