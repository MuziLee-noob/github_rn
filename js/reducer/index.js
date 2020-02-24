import {combineReducers} from 'redux';
import theme from './theme';
import popular from './popular';
import trending from './trending';

/**
 * 合并reducer
 * @type {Reducer<CombinedState<{}>>}
 */
const index = combineReducers({
    theme: theme,
    popular: popular,
    trending: trending
});

export default index;
