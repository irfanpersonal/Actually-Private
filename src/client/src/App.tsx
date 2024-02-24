import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {AddPost, Admin, Auth, Error, Explore, Home, HomeLayout, Landing, Post, Profile, ProtectedRoute, Search, User} from './pages';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from './store';
import {Loading} from './components';
import {showCurrentUser} from './features/user/userThunk';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout/>,
		errorElement: <Error/>,
		children: [
			{
				index: true,
				element:  <ProtectedRoute role={['user']}><Home/></ProtectedRoute>
			},
			{
				path: 'add-post',
				element: <ProtectedRoute role={['user']}><AddPost/></ProtectedRoute>
			},
			{
				path: 'explore',
				element: <ProtectedRoute role={['user']}><Explore/></ProtectedRoute>
			},
			{
				path: 'search',
				element: <ProtectedRoute role={['user']}><Search/></ProtectedRoute>
			},
			{
				path: 'user/:id',
				element: <ProtectedRoute role={['user']}><User/></ProtectedRoute>
			},
			{
				path: 'post/:id',
				element: <ProtectedRoute role={['user']}><Post/></ProtectedRoute>
			},
			{
				path: 'profile',
				element: <ProtectedRoute role={['user']}><Profile/></ProtectedRoute>
			}
		]
	},
	{
		path: '/auth',
		element: <Auth/>,
		errorElement: <Error/>
	},
	{
		path: '/landing',
		element: <Landing/>,
		errorElement: <Error/>
	},
	{
		path: 'admin',
		element: <ProtectedRoute role={['admin']}><Admin/></ProtectedRoute>,
		errorElement: <Error/>
	}
]);

const App: React.FunctionComponent = () => {
	const dispatch = useDispatch<useDispatchType>();
	const {globalLoading} = useSelector((store: useSelectorType) => store.user);
	const {location} = useSelector((store: useSelectorType) => store.navigation);
	React.useEffect(() => {
		dispatch(showCurrentUser());
	}, []);
	React.useEffect(() => {
		if (window.location.pathname !== location) {
			router.navigate(location);
		}
	}, [location]);
	if (globalLoading) {
		return (
			<Loading title='Loading Application' position='center'/>
		);
	}
	return (
		<RouterProvider router={router}/>
	);
}

export default App;