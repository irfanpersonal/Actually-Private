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
    color: white;
    .topic {
        font-size:14px;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        margin: 0px 10px;
        padding: 20px 0px;
        border-bottom: 1px solid #27343e;
    }
    .topic:hover, .topic:active {
        border-color:#FFFFFF;
    }
`;

export default TrendingTopicsListItem;