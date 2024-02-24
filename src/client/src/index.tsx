import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

import store from './store';
import {Provider} from 'react-redux';

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.querySelector('#root') as HTMLDivElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
	<Provider store={store}>
		<App/>
		<ToastContainer position='top-center'/>
	</Provider>
);