import {useSelector, useDispatch} from "react-redux";
import {showModalFalse} from "../features/modal/modalSlice";
import {Link} from 'react-router-dom';

const Modal = () => {
    const dispatch = useDispatch();
    const {title, data} = useSelector(store => store.modal);
    return (
        <div style={{border: '1px solid black', padding: '0.5rem', width: '50%', minHeight: '50%', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'lightgray'}}>
            <h1 onClick={() => dispatch(showModalFalse())} style={{backgroundColor: 'lightcoral', textAlign: 'center'}}>CLOSE</h1>
            <h1 style={{textAlign: 'center', margin: '1rem 0'}}>{title}</h1>
            <section>
                {data.map(item => {
                    return (
                        <article key={item._id} style={{border: '1px solid black', marginBottom: '1rem', padding: '1rem'}}>
                            {item.profilePicture ? (
                                <img style={{width: '50px', height: '50px'}} src={item.profilePicture} alt={item.name}/>
                            ) : (
                                <h1>No Profile Picture</h1>
                            )}
                            <h1>{item.name}</h1>
                            <Link onClick={() => dispatch(showModalFalse())} to={`/profile/${item._id}`}>Go to Profile</Link>
                        </article>
                    );
                })}
            </section>
        </div>
    );
}

export default Modal;