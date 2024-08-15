import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getTrendingBoxInformation} from '../features/explore/exploreThunk';
import {Link, useNavigate} from 'react-router-dom';
import {setSearch} from '../features/search/searchSlice';
import {getGlobalSearch} from '../features/search/searchThunk';
import styled from 'styled-components';

const TrendingBox: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {getTrendingBoxInformationLoading, trendingBoxInformation} = useSelector((store: useSelectorType) => store.explore);
    React.useEffect(() => {
        dispatch(getTrendingBoxInformation());
    }, []);
    return (
        <Wrapper className="quarter">
                {getTrendingBoxInformationLoading ? (
                    <h1>Loading Trending Box Information...</h1>
                ) : (
                    <div className="inner">
                        <div className="boxItem">
                            <div className="pad10">
                                <div className="f16 cWhite semiBold pad10 padBottom10 underline">Trending</div>
                                <div className="f14 cGray pad10">See What's Trending on AP now.</div>
                            </div>
                            {!trendingBoxInformation.length && (
                                <div className="f16 cWhite semiBold pad10 padBottom10 tCenter underline">Sorry, there aren't enough posts to show trending topics.</div>
                            )}
                            {trendingBoxInformation.slice(0, 5).map(trendingTopic => {
                                return (
                                    <div key={trendingTopic} className="trendingItem" onClick={() => {
                                        dispatch(setSearch(trendingTopic));
                                        dispatch(getGlobalSearch());
                                        navigate('/search');
                                        
                                    }}>
                                        <div className="column flexFull">
                                            <div className="f14 cWhite">#{trendingTopic}</div>
                                        </div>
                                    </div>
                                );
                            })}
                            {(trendingBoxInformation.length > 0) && (
                                <div className="pad20">
                                    <Link to='/explore' className='f14 cBlue block tCenter nUnderline'>View More</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .trendingItem {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0px 20px;
        padding: 20px 0px;
        border-bottom: 1px solid #27343e;
    }
    .trendingItem:hover, .trendingItem:active {
        border-bottom: 1px solid rgb(179, 200, 207);
    }
    .f14.cBlue.tCenter.block.nUnderline:hover {
        opacity:0.7;
    }
`;

export default TrendingBox;