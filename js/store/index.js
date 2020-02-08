import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer';

const middlewares = [
    thunk
];

/**
 * 创建中间件
 */
export default createStore(reducers, applyMiddleware(...middlewares));
