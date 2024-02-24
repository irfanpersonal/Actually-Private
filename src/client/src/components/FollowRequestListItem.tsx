import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {type FollowRequestType} from '../features/followRequests/followRequestsSlice';
import {FaWindowClose} from 'react-icons/fa';
import {IoIosCheckmarkCircle} from "react-icons/io";
import {updateFollowRequest} from '../features/followRequests/followRequestsThunk';

interface FollowRequestListItemProps {
    data: FollowRequestType
}

const FollowRequestListItem: React.FunctionComponent<FollowRequestListItemProps> = ({data}) => {
    const dispatch = useDispatch<useDispatchType>();
    return (
        <Wrapper>
            <div className="user-info">
                <img className="pfp" src={data.from.profilePicture || emptyProfilePicture} alt={data.from.name}/>
                <div>{data.from.name}</div>
            </div>
            <div className="user-options">
                <div onClick={() => {
                    const formData = new FormData();
                    formData.append('status', 'rejected');
                    dispatch(updateFollowRequest({followRequestID: data._id, data: formData, accepted: false}));
                }}><FaWindowClose/></div>
                <div onClick={() => {
                    const formData = new FormData();
                    formData.append('status', 'accepted');
                    dispatch(updateFollowRequest({followRequestID: data._id, data: formData, accepted: true}));
                }}><IoIosCheckmarkCircle/></div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    outline: 1px solid black;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-info {
        display: flex;
        align-items: center;
        .pfp {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            margin-right: 0.5rem;
            padding: 0.5rem;
        }
    }
    .user-options {
        display: flex;
        svg {   
            cursor: pointer;
            font-size: 1.25rem;
            margin-left: 0.25rem;
        }
    }
`;  

export default FollowRequestListItem;