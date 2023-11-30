import React from 'react';
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {AddPost, Auth, Error, HomeLayout, Home, Landing, Post, Profile, UserProfile, Search, ProtectedRoute} from './pages';
import {useDispatch, useSelector} from "react-redux";
import {showCurrentUser} from "./features/user/userThunk";

import store from './store.js';
import {loader as profileLoader} from './pages/Profile.js';
import {loader as postLoader} from './pages/Post.js';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout/>,
		errorElement: <Error/>,
		children: [
			{
				index: true,
				element: <Home/>
			},
			{
				path: 'auth',
				element: <Auth/>
			},
			{
				path: 'post/:id',
				element: <Post/>,
				loader: postLoader(store)
			},
			{
				path: 'profile',
				element: <ProtectedRoute><UserProfile/></ProtectedRoute>
			},
			{
				path: 'add-post',
				element: <ProtectedRoute><AddPost/></ProtectedRoute>
			},
			{
				path: 'search',
				element: <Search/>
			},
			{
				path: 'profile/:id',
				element: <Profile/>,
				loader: profileLoader(store)
			}
		]
	},
	{
		path: '/landing',
		element: <Landing/>
	}
]);

const App = () => {
	const {isLoading} = useSelector(store => store.user);
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(showCurrentUser());
	}, []);
	if (isLoading) {
		return (
			<h1>Loading...</h1>
		);
	}
	return (
		<RouterProvider router={router}/>
	);
}

export default App;