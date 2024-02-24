import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {createPost} from '../features/post/postThunk';

const AddPost: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {createPostLoading} = useSelector((store: useSelectorType) => store.post);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (target.image.files[0]) {
            formData.append('image', target.image.files[0]);
        }
        formData.append('content', (target.elements.namedItem('content') as HTMLTextAreaElement).value);
        formData.append('location', (target.elements.namedItem('location') as HTMLInputElement).value);
        dispatch(createPost(formData));
    }
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="title">Create Post</div>
                <div>
                    <label htmlFor="image">Post Image (*)</label>
                    <input id="image" type="file" name="image"/>
                </div>
                <div>
                    <label htmlFor="content">Content (*)</label>
                    <textarea id="content" name="content"></textarea>
                </div>
                <div>
                    <label htmlFor="location">Location</label>
                    <input id="location" type="text" name="location"/>
                </div>
                <button type="submit" disabled={createPostLoading}>{createPostLoading ? 'Creating Post' : 'Create Post'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    form {
        width: 70%;
        outline: 1px solid black;
        padding: 1rem;
        .title {
            background-color: black;
            color: white;
            text-align: center;
            padding: 0.5rem;
        }
        #image {
            margin-top: 0.25rem;
            outline: 1px solid black;
            width: 100%;
            padding: 0.25rem;
        }
        label {
            display: block;
            margin-top: 0.25rem;
        }
        #content {
            width: 100%;
            height: 120px;
            resize: none;
            padding: 0.5rem;
        }
        #location {
            width: 100%;
            padding: 0.5rem;
        }
        button {
            width: 100%;
            margin-top: 1rem;
            padding: 0.25rem;
        }
    }
`;

export default AddPost;