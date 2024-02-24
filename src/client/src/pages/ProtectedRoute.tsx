import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {type useSelectorType} from '../store';

interface ProtectedRouteProps {
    children: React.ReactNode,
    role: any[]
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = ({children, role}): any => {
    const {user} = useSelector((store: useSelectorType) => store.user);
    if (!role.includes(user!?.role)) {
        if (user?.role === undefined) {
            return <Navigate to='/landing'/>
        }
        else if (user?.role === 'user') {
            return <Navigate to='/landing'/>
        }
        else if (user?.role === 'admin') {
            return <Navigate to='/admin'/>
        }
    }
    return children;
}

export default ProtectedRoute;