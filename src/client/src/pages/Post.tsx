import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useNavigate, useParams, Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, CommentList, PaginationBox} from '../components';
import {FaTrash, FaArrowAltCircleLeft, FaEdit, FaHeart, FaRegCommentDots, FaArrowRight} from "react-icons/fa";
import {IoMdCloseCircle} from "react-icons/io";
import {FiCopy} from "react-icons/fi";
import {MdAutoDelete} from "react-icons/md";
import {deleteSinglePost, getSinglePost, getSinglePostComments, likeSinglePost, unlikeSinglePost, updateSinglePost} from '../features/singlePost/singlePostThunk';
import {createComment} from '../features/post/postThunk';
import {setPage} from '../features/singlePost/singlePostSlice';

const Post: React.FunctionComponent = () => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const toggleEdit = () => {
        setIsEditing(currentState => {
            return !currentState;
        });
    }
    const toggleShowMessage = () => {
        setShowMessage(currentState => {
            return !currentState;
        });
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('content', (target.elements.namedItem('content') as HTMLTextAreaElement).value);
        dispatch(createComment({id: id!, data: formData}));
        toggleShowMessage();
    }
    const handleEditSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (target.image.files[0]) {
            formData.append('image', target.image.files[0]);
        }
        formData.append('content', (target.elements.namedItem('content') as HTMLTextAreaElement).value);
        formData.append('location', (target.elements.namedItem('location') as HTMLInputElement).value);
        dispatch(updateSinglePost({postID: id!, data: formData}));
    }
    const {getSinglePostLoading, singlePost, getSinglePostCommentsLoading, comments, totalComments, numberOfPages, redirectHome, yourPost, deleteSinglePostLoading, liked, page} = useSelector((store: useSelectorType) => store.singlePost);
    const {creatingComment} = useSelector((store: useSelectorType) => store.post);
    React.useEffect(() => {
        if (redirectHome) {
            navigate('/');
            return;
        }
        dispatch(getSinglePost(id!));
        dispatch(getSinglePostComments(id!));
    }, [redirectHome]);
    return (
        <Wrapper>
            {getSinglePostLoading ? (
                <Loading title='Loading Single Post' position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <div className="post-navigation">
                        <div>
                            <div onClick={() => {
                                navigate(-1);
                            }} style={{cursor: 'pointer', color: 'white'}}><FaArrowAltCircleLeft/></div>
                        </div>
                        <div>
                            <div>{isEditing ? 'Editing Single Post' : 'Viewing Single Post'}</div>
                        </div>
                        <div className="post-user-actions">
                            {yourPost && (
                                <>
                                    <div className="edit" onClick={toggleEdit}>{isEditing ? <IoMdCloseCircle className="trash"/> : <FaEdit/>}</div>
                                    <div className="trash" onClick={() => {
                                        if (deleteSinglePostLoading) {
                                            return;
                                        }
                                        dispatch(deleteSinglePost(id!));
                                    }}>{deleteSinglePostLoading ? <MdAutoDelete/> : <FaTrash/>}</div>
                                </>
                            )}
                            <div onClick={async() => {
                                if (navigator.clipboard) {
                                    await navigator.clipboard.writeText(window.location.href);
                                }
                                toast.success('Copied Link!');
                            }} className="copy"><FiCopy/></div>
                        </div>
                    </div>
                    {isEditing ? (
                        <form className="edit-post-form" onSubmit={handleEditSubmit}>
                            <div className="post-data">
                                <p>Current Image</p>
                                <img className="small-image" src={singlePost!.image}/>
                                <label htmlFor="image">Post Image</label>
                                <input id="image" type="file" name="image" alt={singlePost!.user.name}/>
                            </div>
                            <div>
                                <label htmlFor="location">Location</label>
                                <input id="location" name="location" defaultValue={singlePost!.location} required/>
                            </div>
                            <div className="form-input">
                                <textarea name="content" defaultValue={singlePost!.content} required></textarea>
                                <button type="submit" className="create-comment"><FaArrowRight/></button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="post-info">
                                <div className="post-header">  
                                    <img className="profile-picture" src={singlePost!?.user.profilePicture || emptyProfilePicture} alt={singlePost!?.user.name}/> 
                                    <div className="post-info">
                                        <div className="user-name"><Link to={`/user/${singlePost!?.user._id}`}>{singlePost!?.user.name}</Link></div> 
                                        <div>{singlePost!?.location}</div>
                                    </div>
                                </div>
                                <img className="post-image" src={singlePost!?.image} alt={singlePost!?.user.name}/>
                                <div className="post-actions">
                                    <div onClick={() => {
                                        if (liked) {
                                            dispatch(unlikeSinglePost(id!));
                                            return;
                                        }
                                        dispatch(likeSinglePost(id!));
                                    }} className={`icon ${liked ? 'liked' : 'unliked'}`}><FaHeart/> {singlePost!?.likes.length}</div>
                                    <div onClick={() => {
                                        toggleShowMessage();
                                    }} className="icon"><FaRegCommentDots/></div>
                                </div>
                                <div><Link to={`/user/${singlePost!?.user._id}`} className="user-name">{!yourPost ? singlePost!?.user.name : 'You'}</Link>: {singlePost!?.content}</div>
                                {showMessage && (
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-input">
                                            <textarea name="content" required></textarea>
                                            <button type="submit" className="create-comment" disabled={creatingComment}>{creatingComment ? <div className="loading"></div> : <FaArrowRight/>}</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
            {getSinglePostCommentsLoading ? (
                <Loading title='Loading Single Post Comments' position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <CommentList data={comments} totalComments={totalComments!}/>
                    {numberOfPages! > 1 && (
                        <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getSinglePostComments} _id={id!}/>
                    )}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .post-navigation {
        padding: 0.5rem;
        background-color: black;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .edit, .trash, .copy {
        cursor: pointer;
    }
    .edit:hover, .edit:active {
        color: gray;
    }
    .trash:hover, .trash:active {
        color: lightcoral;
    }
    .copy:hover, .copy:active {
        color: lightblue;
    }
    .post-user-actions {
        display: flex;
        div {
            margin-left: 1rem;
        }
    }
    .post-header {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        .post-info {
            margin-left: 1rem;
        }
        .profile-picture {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            outline: 1px solid black;
        }
    }
    .user-name {
        text-decoration: underline;
        color: black;
        a {
            color: black;
        }
    }
    .post-image {
        border-radius: 1rem;
        width: 100%;
        height: 20rem;
        outline: 1px solid black;
    }
    .post-actions {
        display: flex;
        .icon {
            cursor: pointer;
            margin-right: 1rem;
        }
    }
    .unliked {
        color: gray;
    }
    .liked {
        color: red;
    }
    form {
        margin-top: 0.5rem;
        .form-input {
            display: flex;
        }
        textarea {
            outline: none;
            border: 1px solid black;
            width: 100%;
            resize: none;
            height: 5rem;
            padding: 0.5rem;
            border-top-left-radius: 1rem;
            border-bottom-left-radius: 1rem;
        }
        button {
            border: none;
            background-color: transparent;
            padding: 1rem;
            background-color: green;
            border-top-right-radius: 1rem;
            border-bottom-right-radius: 1rem; 
            cursor: pointer;
        }
        button:hover, button:active {
            outline: 1px solid black;
        }
    }
    .loading {
        border: 0.25rem solid white;
        border-top: 0.25rem solid black;
        border-radius: 50%;
        width: 1rem;
        height: 1rem;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { 
            transform: rotate(0deg); 
        }
        100% { 
            transform: rotate(360deg); 
        }
    }
    .small-image {
        width: 5rem;
        height: 5rem;
        outline: 1px solid black;
    }
    .edit-post-form {
        p {
            text-align: center;
            margin-top: 0.5rem;
        }
        img {
            display: block;
            margin: 0 auto;
            margin-top: 0.5rem;
        }
        label {
            display: block;
            text-align: center;
            margin-top: 0.5rem;
        }
        input {
            display: block;
            margin: 0 auto;
            outline: 1px solid black;
            margin-top: 0.5rem;
            margin-bottom: 1rem;
            padding: 0.5rem
        }
    }
`;

export default Post;