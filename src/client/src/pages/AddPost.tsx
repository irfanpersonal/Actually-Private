import React, { useState } from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {createPost} from '../features/post/postThunk';
import {FaImage, FaVideo, FaFile} from 'react-icons/fa6';
import {MdAudiotrack} from "react-icons/md";
import {FaPaperPlane} from "react-icons/fa";
import {IoMdTime} from "react-icons/io";
import {PostsListItem} from '../components';
import {nanoid} from 'nanoid'
import { IoIosSend } from "react-icons/io";

const AddPost: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {createPostLoading, createdPostArray} = useSelector((store: useSelectorType) => store.post);
    const attachmentInputRef = React.useRef<HTMLInputElement>(null);
    const [attachmentValue, setAttachmentValue] = React.useState<string>('');
    const handleFileChange = () => {
        if (attachmentInputRef.current && attachmentInputRef.current.files!.length > 0) {
            setAttachmentValue(attachmentInputRef.current.files![0].name);
        }
    };
    const handleFileRemoval = () => {
        attachmentInputRef.current!.value = '';
        setAttachmentValue('');
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (target.attachment.files[0]) {
            formData.append('attachment', target.attachment.files[0]);
        }
        formData.append('content', (target.elements.namedItem('content') as HTMLTextAreaElement).value);
        formData.append('location', (target.elements.namedItem('location') as HTMLInputElement).value);
        dispatch(createPost(formData));
    }

    const [content, setContent] = React.useState<string>('');
    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setContent(event.target.value);
    };
    
    return (
        <>
            <Wrapper onSubmit={handleSubmit}>
                <div className="boxItem">
                    <div className="row pad20">
                        <img src={user!.profilePicture || emptyProfilePicture} alt={user!.name}/>
                        <div className="main-input">
                            <textarea name="content" placeholder="What's happening?" onChange={handleChange}  required/>
                            {/* <div className="sendButton">Post</div> */}
                            {content && <button className="sendButton" type='submit' disabled={createPostLoading}>{createPostLoading ? <IoMdTime size={'0.75rem'} color={'black'}/> : 'Post'}</button>}
                            {/* {content && <button className="sendButton" type='submit' disabled={createPostLoading}>{createPostLoading ? <IoMdTime size={'0.75rem'} color={'black'}/> : 'Post'}</button> */}
                            <input ref={attachmentInputRef} id="attachment" type="file" name="attachment" className="hide" onChange={handleFileChange}/>
                            <input id="location" type="text" name="location" placeholder='Location of Post'/>
                            {attachmentValue && (
                                <div className="attachment">
                                    <div className="attachment-status">📁 {attachmentValue}</div>
                                    <div className="clear-btn" onClick={handleFileRemoval}>❌</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="post-type-container">
                        <div className="post-types">
                            <div className="post-type" onClick={() => {
                                attachmentInputRef.current!.accept = 'image/*';
                                attachmentInputRef.current!.click();
                            }}>
                                <FaImage size={'1rem'} color={'rgb(30, 218, 151)'}/>
                                <div className="post-type-label">Photo</div>
                            </div>
                            <div className="post-type" onClick={() => {
                                attachmentInputRef.current!.accept = 'video/*';
                                attachmentInputRef.current!.click();
                            }}>
                                <FaVideo size={'1rem'} color={'rgb(76, 146, 255)'}/>
                                <div className="post-type-label">Video</div>
                            </div>
                            <div className="post-type" onClick={() => {
                                attachmentInputRef.current!.accept = 'audio/*';
                                attachmentInputRef.current!.click();
                            }}>
                                <MdAudiotrack size={'1rem'} color={'rgb(255, 106, 106)'}/>
                                <div className="post-type-label">Audio</div>
                            </div>
                            <div className="post-type" onClick={() => {
                                attachmentInputRef.current!.accept = '*/*';
                                attachmentInputRef.current!.click();
                            }}>
                                <FaFile size={'1rem'} color={'rgb(248, 190, 82)'}/>
                                <div className="post-type-label">File</div>
                            </div>
                        </div>
                    </div>
                    <button className="submit-btn" type='submit' disabled={createPostLoading}>{createPostLoading ? <IoMdTime size={'0.75rem'} color={'black'}/> : <FaPaperPlane size={'0.75rem'} color={'black'}/>}</button>
                </div>
            </Wrapper>
            {createdPostArray.map(post => {
                return (
                    <PostsListItem key={nanoid()} data={post} hide={true}/>
                );
            })}
        </>
    );
}

const Wrapper = styled.form`
    padding: 10px;
    .hide {
        display: none;
    }
    .main-input {
        display: flex;
	    flex-direction: column;
	    padding-left: 1rem;
	    flex: 1;
        position:relative;
        textarea {
            outline: none;
            height: 75px;
            resize: none;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            border-width: 0;
            border-radius: 12px 12px 0px 0px;
            background-color: rgb(39, 52, 62);
            padding: 15px 40px 0px 15px;
            color: white;
            overflow:hidden;
            
        }
        textarea::placeholder {
            color:#FFFFFF;
        }
        .attachment {
            display: flex;
            align-items: center;
            margin-top: 1rem;
            .attachment-status {
                text-decoration: underline;
                color: white;
            }
            .clear-btn {
                cursor: pointer;
                color: white;
                margin-left: 0.5rem;
            }
        }
        #location {
            outline:0px;
            margin-top:0px;
            color:#6c7a87;
            border-width:0px;
            padding:10px 0px 10px 15px;
            border-radius:0px 0px 12px 12px;
            background-color:#27343e;
        }
        #location::placeholder {
            color: #6c7a87;
            opacity: 1; 
        }
    }
    img {
        width: 3.125rem;
        height: 3.125rem;
        object-fit: cover;
        border-radius: 50%;
        background-color: white;
    }
    .post-type-container {
        display: flex;
	    flex-direction: column;
        .post-types {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0 1.25rem 1.25rem 5.3125rem;
            .post-type {
                user-select: none;
                cursor: pointer;
                flex: 1;
                display: flex;
                padding: 0.75rem;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                margin-right: 0.5rem;
                border-radius: 2rem;
                border: 1px solid rgb(39, 52, 62);
                &:hover {
                    outline: 1px solid white;
                }
                .post-type-label {
                    color: white;
                    font-size: 0.75rem;
                    margin-left: 0.75rem;
                }
            }
        }
    }
    .submit-btn {
        width: 100%;
        padding: 0.25rem;
        display:none;
    }
    .sendButton {
        width:40px;
        height:40px;
        font-size:10px;
        color:#FFFFFF;
        display:flex;
        border-radius:12px;
        align-items: center;
        justify-content: center;
        background-color:#1c9be8;
        border-width:0px;
        position:absolute;
        right:10px;
        top:12px;
    }
    /* WebKit Browsers */
    @media (max-width:768px) {
        .post-type-container .post-types {
            padding-left:15px;
        }
    }
    
`;

export default AddPost;