import styled from 'styled-components';
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from "react-icons/fa";
import {nanoid} from 'nanoid';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';

interface PaginationBoxProps {
    _id?: string,
    numberOfPages: number,
    changePage: Function,
    page: number,
    updateSearch: Function
}

const PaginationBox: React.FunctionComponent<PaginationBoxProps> = ({_id, page, numberOfPages, changePage, updateSearch}) => {
    const dispatch = useDispatch<useDispatchType>();
    const previousPage = () => {
        const newValue = page - 1;
        if (newValue === 0) {
            dispatch(changePage(numberOfPages));
            return;
        }
        dispatch(changePage(newValue));
    }
    const nextPage = () => {
        const newValue = page + 1;
        if (newValue === (numberOfPages + 1)) {
            dispatch(changePage(1));
            return;
        }
        dispatch(changePage(newValue));
    }
    return (
        <Wrapper>
            <span onClick={() => {
                previousPage();
                dispatch(updateSearch(_id));
            }}><FaArrowAltCircleLeft/></span>
            {Array.from({length: numberOfPages}, (_, index) => {
                return (
                    <span style={{backgroundColor: page === index + 1 ? 'blue' : ''}} onClick={() => {
                        dispatch(changePage(index + 1));
                        dispatch(updateSearch(_id));
                    }} key={nanoid()}>{index + 1}</span>
                );
            })}
            <span onClick={() => {
                nextPage();
                dispatch(updateSearch(_id));
            }}><FaArrowAltCircleRight/></span>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    span {
        cursor: pointer;
        margin: 0 0.5rem;
        padding: 10px;
        border: 2px solid black;
        border-radius: 5px;
        color: #fff;
        background-color: black;
        transition: background-color 0.3s, border-color 0.3s;
    }
    span > svg {
        font-size: 1rem;
    }
`;

export default PaginationBox;