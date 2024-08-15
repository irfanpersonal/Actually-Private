import React from 'react';
import cover from '../images/cover.jpg';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getUserBoxInformation} from '../features/user/userThunk';
import DiscoverPeople from './DiscoverPeople';
import {FaLocationDot} from "react-icons/fa6";

const UserBox: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {getUserBoxInformationLoading, userBoxInformation} = useSelector((store: useSelectorType) => store.user);
    React.useEffect(() => {
        dispatch(getUserBoxInformation());
    }, []);
    return (
        <Wrapper className="quarter">
            {getUserBoxInformationLoading ? (
                <h1>Loading User Box Information</h1>
            ) : (
                <div className="inner profileUnit">
                    <div className="boxItem">
                        <div>
                            <img className="coverPhoto" src={cover}/>
                        </div>
                        <div className="tCenter offsetProfile">
                            <img className="img70Round" src={userBoxInformation!.profilePicture || emptyProfilePicture}/>
                        </div>
                        <div className="f16 cWhite semiBold tCenter">{userBoxInformation!.nickName}</div>
                        <div className="f14 cGray tCenter">@{userBoxInformation!.name}</div>
                        {userBoxInformation!.location && (
                            <div className="location"><FaLocationDot size={'12px'}/>{userBoxInformation!.location}</div>
                            // <div><FaLocationDot/> {userBoxInformation!.location}</div>
                        )}
                        <div className="f14 cWhite tCenter userBio">{userBoxInformation!.bio}</div>
                        <div className="row pad20 borderBox">
                            <div className="flexFull column aCenter">
                                <div className="f14 cWhite">{userBoxInformation!.following.length}</div>
                                <div className="f14 cGray">Following</div>
                            </div>
                            <div className="verticalSeperator"></div>
                            <div className="flexFull column aCenter">
                                <div className="f14 cWhite">{userBoxInformation!.followers.length}</div>
                                <div className="f14 cGray">Followers</div>
                            </div>
                        </div>
                        <div className="pad20">
                            <Link className="f14 cBlue tCenter block nUnderline" to='/profile'>My Profile</Link>
                        </div>
                    </div>
                </div>
            )}
            <DiscoverPeople/>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .offsetProfile {
        margin-top: -45px;
        margin-bottom:10px;
    }
    .location {
        font-size:14px;
        margin-top:10px;
        color: #FFFFFF;
        text-align: center;
        svg {
            margin-right: 8px
        }
    }
    .userBio {
        padding:10px 10px 15px 10px;
    }
    .f14.cBlue.tCenter.block.nUnderline:hover , .whiteRoundButton:hover {
        opacity:0.7;
    }
`;

export default UserBox;