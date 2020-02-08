import Types from '../types';
import DataStore from '../../expand/dao/DataStore';

/**
 * 获取最热数据action
 * @param storeName
 * @param url
 * @param pageSize
 * @returns
 */
export function onLoadPopularData(storeName, url, pageSize) {
    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url) //异步action与数据流
            .then(data => {
                handleData(dispatch, storeName, data, pageSize);
            })
            .catch(error => {
                console.error(error);
                dispatch({type: Types.POPULAR_REFRESH_FAIL, storeName, error});
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
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray= [], callBack) {
    return dispatch => {
        setTimeout(() => {
            console.log('111111111111111');
            if ((pageIndex - 1) * pageSize >= dataArray.length) { // 已加载完所有数据
                if (typeof callBack === 'function') {
                    callBack("no more data")
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more data',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                })
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0, max),
                })
            }
        }, 500);
        console.log('111111111')
    }
}

/**
 *
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 */
function handleData(dispatch, storeName, data, pageSize) {
    let fixItems = [];
    if (data && data.data && data.data.items) {
        fixItems = data.data.items;
    }
    dispatch({
        type: Types.POPULAR_REFRESH_SUCCESS,
        items: fixItems,
        projectModes: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize), // 第一次要加载的数据
        storeName,
        pageIndex: 1
    })
}
