import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'; // eslint-disable-line import/no-extraneous-dependencies
import authReducer from '../reducers/auth';
import newsReducer from '../reducers/news';

const store = createStore(
	combineReducers({
		auth: authReducer,
		news: newsReducer,
	}),
	composeWithDevTools(applyMiddleware(thunk)),
);

export default () => store;
