import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData} from '../ActionUtil';

/**
 * 获取趋势数据action
 * @param storeName
 * @param url
 * @param pageSize
 * @returns
 */
export function onLoadTrendingData(storeName, url, pageSize) {
    return dispatch => {
        dispatch({type: Types.TRENDING_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url, FLAG_STORAGE.flag_trending) //异步action与数据流
            .then(data => {
                handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize);
            })
            .catch(error => {
                console.error(error);
                dispatch({type: Types.TRENDING_REFRESH_FAIL, storeName, error});
            })
    }
}

/**
 * 上拉加载更多
 * @param storeName
 * @param pageIndex
 * @param pageSize
 * @param dataArray
 * @param callBack
 */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray= [], callBack) {
    return dispatch => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) { // 已加载完所有数据
                if (typeof callBack === 'function') {
                    callBack("no more data")
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more data',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                })
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels: dataArray.slice(0, max),
                })
            }
        }, 500);
    }
}


