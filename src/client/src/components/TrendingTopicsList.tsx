import TrendingTopicsListItem from "./TrendingTopicsListItem";
import styled from 'styled-components';
import {nanoid} from 'nanoid';

interface TrendingTopicsListProps {
    data: string[]
}

const TrendingTopicsList: React.FunctionComponent<TrendingTopicsListProps> = ({data}) => {
    return (
        <Wrapper>
            <div className="f16 cWhite semiBold pad10 padBottom10 underline">Trending Topics</div>
            {data.map((item, index) => {
                return (
                    <TrendingTopicsListItem key={nanoid()} data={item} index={index}/>
                );
            })}
        </Wrapper>
    );
}

const Wrapper = styled.section`

`;

export default TrendingTopicsList;