import styled from 'styled-components';
import {Outlet} from 'react-router-dom';
import {Navbar} from '../components';

const HomeLayout: React.FunctionComponent = () => {
    return (
        <Wrapper>
            <div className="twenty">
                <Navbar/>
            </div>
            <section className="eighty">
                <Outlet/>
            </section>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    .twenty {
        width: 20%;
    }
    .eighty {
        width: 80%;
        padding: 0.5rem;
    }
`;

export default HomeLayout;