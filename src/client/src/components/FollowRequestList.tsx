import React from 'react';
import {nanoid} from 'nanoid';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {setPage} from '../features/followRequests/followRequestsSlice';
import {viewAllFollowRequests} from '../features/followRequests/followRequestsThunk';
import {Loading, FollowRequestListItem, PaginationBox} from '../components';

const FollowRequestList: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {followRequests, viewAllFollowRequestsLoading, totalFollowRequests, numberOfPages, page} = useSelector((store: useSelectorType) => store.followRequests);
    React.useEffect(() => {
        dispatch(viewAllFollowRequests());
    }, []);
    return (
        <>
            {viewAllFollowRequestsLoading ? (
                <Loading title="" position='normal' marginTop='1rem'/>
            ) : (
                <>
                    {totalFollowRequests ? (
                        <div style={{textAlign: 'center', marginTop: '0.5rem'}} className="title">{totalFollowRequests} Follow Request{totalFollowRequests! > 1 && 's'} Found...</div>
                    ): (
                        <div style={{textAlign: 'center', marginTop: '1rem', textDecoration: 'underline'}}>No Follow Requests Found</div>
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
        </>
    );
}

export default FollowRequestList;