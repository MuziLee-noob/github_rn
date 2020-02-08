import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer';

/**
 * 自定义日志中间件
 * @param store
 * @returns {function(*): function(...[*]=)}
 */
const logger = store => next => action => {
    if (typeof action === 'function') {
        console.log('diapatching a action');
    } else {
        console.log('dispatching', action);
    }
    const result = next(action);
    console.log('nextState', store.getState());
    return result;
};

const middlewares = [
    thunk,
    logger
];

/**
 * 创建中间件
 */
export default createStore(reducers, applyMiddleware(...middlewares));
