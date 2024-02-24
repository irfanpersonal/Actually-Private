import React from 'react';
import styled from 'styled-components';
import PostsListItem from './PostsListItem';
import {PostType} from '../features/profile/profileSlice';
import {nanoid} from 'nanoid';
import {MdGridView} from "react-icons/md";
import {GiHamburgerMenu} from "react-icons/gi";

type ViewType = 'grid' | 'list';

interface PostsListProps {
    data: PostType[],
    totalPosts: number,
    hide: boolean
}

const PostsList: React.FunctionComponent<PostsListProps> = ({data, totalPosts, hide}) => {
    const [viewType, setViewType] = React.useState<ViewType>('grid');
    return (
        <Wrapper>
            <div className="list-info">
                <h1>{totalPosts} Post{totalPosts! > 1 && 's'} Found...</h1>
                <div>
                    <MdGridView onClick={() => setViewType(currentState => 'grid')} className={`view-type ${viewType === 'grid' && 'active-type'}`}/>
                    <GiHamburgerMenu onClick={() => setViewType(currentState => 'list')} className={`view-type ${viewType === 'list' && 'active-type'}`}/>
                </div>
            </div>
            <div className={`${viewType === 'grid' && 'grid-styling'}`}>
                {data.map(item => {
                    return (
                        <PostsListItem key={nanoid()} data={item} hide={hide}/>
                    );
                })}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.section`
    .list-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
        margin-bottom: 1rem;
    }
    .view-type {
        cursor: pointer;
        font-size: 1.5rem;
        margin-left: 0.5rem;
        padding: 0.25rem;
        border-radius: 0.5rem;
        outline: 1px solid black;
    }
    .active-type {
        background-color: rgb(146, 199, 207);
    }
    .grid-styling {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
    }
`;

export default PostsList;