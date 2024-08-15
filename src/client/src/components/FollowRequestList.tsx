import React from 'react';
import styled from 'styled-components';
import {nanoid} from 'nanoid';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {setPage} from '../features/followRequests/followRequestsSlice';
import {viewAllFollowRequests} from '../features/followRequests/followRequestsThunk';
import {Loading, FollowRequestListItem, PaginationBox} from '../components';
import { IoClose } from "react-icons/io5";

const FollowRequestList: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {followRequests, viewAllFollowRequestsLoading, totalFollowRequests, numberOfPages, page} = useSelector((store: useSelectorType) => store.followRequests);
    React.useEffect(() => {
        dispatch(viewAllFollowRequests());
    }, []);
    return (
        <Wrapper>
            {viewAllFollowRequestsLoading ? (
                <Loading title="" position='normal' marginTop='1rem'/>
            ) : (
                <>       
                    {totalFollowRequests ? (
                        <div className="whiteLabel">{totalFollowRequests} Follow Request{totalFollowRequests! > 1 && 's'} Found.</div>
                    ): (
                        <div className="whiteLabel">No Follow Requests Found</div>
                    )}
                    <section>
                        {followRequests.map(followRequest => {
                            return (
                                <FollowRequestListItem data={followRequest} key={nanoid()}/>
                            );
                        })}
                    </section>
                    {numberOfPages! > 1 && (
                        <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={viewAllFollowRequests}/>
                    )}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .whiteLabel {
        padding: 20px;
        font-size:14px;
        color:#FFFFFF;
        border-radius: 10px;
        background-color: #1c2730;
    }
`;


export default FollowRequestList;