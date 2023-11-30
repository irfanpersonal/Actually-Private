import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {createPost, deleteSinglePost, editSinglePost} from '../features/addPost/addPostThunk';
import {updateSinglePostData} from '../features/addPost/addPostSlice';

const AddPost = () => {
    const dispatch = useDispatch();
    const {isEditing, isLoading, isLoadingSinglePost, singlePostData} = useSelector(store => store.addPost);
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('content', event.target.elements.content.value);
        formData.append('image', event.target.image.files[0]);
        if (isEditing) {
            dispatch(editSinglePost({postID: singlePostData._id, post: formData}));
            return;
        }
        dispatch(createPost(formData));
    }
    return (
        <Wrapper>
            <Link to='/'>Back</Link>
            <form onSubmit={handleSubmit}>
                {isLoadingSinglePost ? (
                    <h1>Loading Single Post Data...</h1>
                ) : (
                    <>
                        <h1>{isEditing ? 'Edit Post' : 'Add Post'}</h1>
                        {isEditing && (
                            <>
                                <p>Current Image</p>
                                <img style={{width: '50px', height: '50px'}} src={singlePostData.image}/>
                            </>
                        )}
                        <div>
                            <input type="file" name="image"/>
                        </div>
                        <div>
                            <textarea value={singlePostData.content} onChange={(event) => dispatch(updateSinglePostData({name: event.target.name, value: event.target.value}))} type="text" name="content" style={{width: '100%', resize: 'none', height: '60px'}}></textarea>
                        </div>
                        {isEditing && (
                            <button type="button" style={{margin: '1rem 0'}} onClick={() => {
                                dispatch(deleteSinglePost(singlePostData._id));
                            }}>DELETE</button>
                        )}
                        <button type="submit">{isLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
                    </>
                )}
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    a {
        display: block;
        background-color: lightblue;
        padding: 0.5rem;
        text-align: center;
        text-decoration: none;
        color: black;
    }
    a:hover {
        outline: 1px solid black;
    }
    form {
        width: 50%;
        border: 1px solid black;
        padding: 1rem;
        margin: 1rem auto;
    }
    form > h1 {
        text-align: center;
        background-color: lightgreen;
    }
    button {
        width: 100%;
        padding: 0.5rem;
    }
    input, textarea {
        display: block;
        margin: 1rem 0;
    }
`;

export default AddPost;