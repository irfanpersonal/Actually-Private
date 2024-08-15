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
                <h1 className=""></h1>
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
    
    h1 {
        padding:10px;
        font-size:18px;
        color:#FFFFFF;
        font-weight:500;
        display:none;
    }
`;

export default CommentList;