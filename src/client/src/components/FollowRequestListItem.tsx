import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {type FollowRequestType} from '../features/followRequests/followRequestsSlice';
import {updateFollowRequest} from '../features/followRequests/followRequestsThunk';
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";

interface FollowRequestListItemProps {
    data: FollowRequestType
}

const FollowRequestListItem: React.FunctionComponent<FollowRequestListItemProps> = ({data}) => {
    const dispatch = useDispatch<useDispatchType>();
    return (
        <Wrapper>
            <div className="user-info">
                <img className="img50Round" src={data.from.profilePicture || emptyProfilePicture} alt={data.from.name}/>
                <div className="f14 cWhite">{data.from.name}</div>
            </div>
            <div className="user-options">
                <div onClick={() => {
                    const formData = new FormData();
                    formData.append('status', 'rejected');
                    dispatch(updateFollowRequest({followRequestID: data._id, data: formData, accepted: false}));
                }}><CiCircleRemove color={'#A80000'} size={'32px'}/></div>
                <div onClick={() => {
                    const formData = new FormData();
                    formData.append('status', 'accepted');
                    dispatch(updateFollowRequest({followRequestID: data._id, data: formData, accepted: true}));
                }}><CiCircleCheck color={'#4CAF50'} size={'32px'}/></div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    display:flex;
    align-items: center;
    margin-top:20px;
    .user-info {
        flex:1;
        gap:15px;
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
        gap:10px;
        display:flex;
        flex-direction:row;
        svg {   
            cursor: pointer;
            font-size: 1.25rem;
            margin-left: 0.25rem;
        }
    }
`;  

export default FollowRequestListItem;