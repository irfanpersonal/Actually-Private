import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getDisoverPeopleInformation} from '../features/user/userThunk';

const DiscoverPeople: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {discoverPeopleInformation, getDisoverPeopleInformationLoading} = useSelector((store: useSelectorType) => store.user);
    React.useEffect(() => {
        dispatch(getDisoverPeopleInformation());
    }, []);
    return (
        <Wrapper>
        <div className="inner">
            {getDisoverPeopleInformationLoading ? (
                <h1>Loading Discover People Information...</h1>
            ) : (
                <div className="boxItem">
                    <div className="f16 cWhite semiBold pad20 padBottom10">Discover People</div>
                    {!discoverPeopleInformation.length && (
                        <div className="f16 cWhite semiBold pad20 padBottom10">Sorry, no users available to discover at the moment.</div>
                    )}
                    <div className="pad10">
                        {discoverPeopleInformation.map((discoverPeople) => {
                            return (
                                <div key={discoverPeople!._id} className="row aCenter pad10">
                                    <img src={discoverPeople!.profilePicture || emptyProfilePicture} className="img50Round"/>
                                    <div className="column flexFull padLeft15">
                                        <div className="f14 cWhite">{discoverPeople!.nickName}</div>
                                        <div className="f12 cGray">@{discoverPeople!.name}</div>
                                    </div>
                                    <Link className="whiteRoundButton f12 block nUnderline" to={`/user/${discoverPeople!._id}`}>View</Link>
                                </div>
                            );
                        })}
                    </div>
                    {(discoverPeopleInformation.length != 0) && (
                        <div className="pad20">
                            <Link className="f14 cBlue tCenter block nUnderline" to='/search'>Show More</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .f14.cBlue.tCenter.block.nUnderline:hover , .whiteRoundButton:hover {
        opacity:0.7;
    }
    .padTop0 {
        padding-top:0px;
    }
`;

export default DiscoverPeople;