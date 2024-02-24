import TrendingTopicsListItem from "./TrendingTopicsListItem";
import styled from 'styled-components';
import {nanoid} from 'nanoid';

interface TrendingTopicsListProps {
    data: string[]
}

const TrendingTopicsList: React.FunctionComponent<TrendingTopicsListProps> = ({data}) => {
    return (
        <Wrapper>
            <div className="title">Trending Topics</div>
            {data.map((item, index) => {
                return (
                    <TrendingTopicsListItem key={nanoid()} data={item} index={index}/>
                );
            })}
        </Wrapper>
    );
}

const Wrapper = styled.section`
    outline: 1px solid black;
    .title {
        background-color: black;
        border-bottom: 1px solid black;
        color: white;
        text-align: center;
        padding: 1rem;
    }
    .trending-no {
        text-align: center;
        margin-top: 1rem;
    }
`;

export default TrendingTopicsList;