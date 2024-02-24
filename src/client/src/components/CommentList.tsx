import CommentListItem from './CommentListItem';
import styled from 'styled-components';
import {nanoid} from 'nanoid';
import {type CommentType} from '../features/singlePost/singlePostSlice';

interface CommentListProps {
    data: CommentType[],
    totalComments: number
}

const CommentList: React.FunctionComponent<CommentListProps> = ({data, totalComments}) => {
    return (
        <Wrapper>
            {totalComments ? (
                <h1 className="title">{totalComments} Comment{totalComments! > 1 && 's'} Found...</h1>
            ): (
                <h1 className="center">No Comments Found...</h1>
            )}
            {data.map(item => {
                return (
                    <CommentListItem key={nanoid()} data={item}/>
                );
            })}
        </Wrapper>
    );
}

const Wrapper = styled.section`
    margin-top: 1rem;
    outline: 1px solid black;
    padding: 1rem;
    .title {
        text-align: center;
        background-color: black;
        color: white;
    }
    .center {
        text-align: center;
    }
`;

export default CommentList;