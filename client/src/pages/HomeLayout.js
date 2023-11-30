import {Outlet} from 'react-router-dom';
import {Navbar} from '../components';

const HomeLayout = () => {
    return (
        <>
            <Navbar/>
            <section style={{padding: '0.5rem'}}>
                <Outlet/>
            </section>
        </>
    );
}

export default HomeLayout;