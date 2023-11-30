import {useDispatch, useSelector} from "react-redux";
import {updatePage} from "../features/search/searchSlice";
import {searchUsers} from "../features/search/searchThunk";

const PaginationBox = () => {
    const dispatch = useDispatch();
    const {numberOfPages, page} = useSelector(store => store.search);
    return (
        <section style={{textAlign: 'center', margin: '1rem 0'}}>
            {Array.from({length: numberOfPages}, (value, index) => {
                return (
                    <span style={{backgroundColor: page === index + 1 && 'red', display: 'inline-block', marginRight: '0.5rem', padding: '0.5rem', border: '1px solid black'}} onClick={() => {
                        dispatch(updatePage(index + 1));
                        dispatch(searchUsers());
                    }}>{index + 1}</span>
                );
            })}
        </section>
    );
}

export default PaginationBox;