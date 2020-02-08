import AsyncStorage from '@react-native-community/async-storage';

export default class DataStore {

    /**
     * 入口函数，实现本地存储和网络获取的逻辑
     * @param url
     * @returns {Promise<unknown>|Promise<T>}
     */
    fetchData(url) {
        return new Promise((resolve, reject) => {
            this.fetchLoaclData(url).then((wrapData) => {
                if (warpData && DataStore.checkTimeStampValid(wrapData.timeStamp)) {
                    resolve(wrapData);
                } else {
                    this.fetchNetData(url).then((data) => {
                        resolve(this._wrapData(data));
                    }).catch((error) => {
                        reject(error);
                    })
                }
            })
        }).catch((error) => {
            this.fetchNetData(url).then((data) => {
                resolve(this._wrapData(data));
            }).catch((error) => {
                reject(error);
            })
        })
    }

    saveData(url, data, callback) {
        if (!data || !url) return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
    }

    fetchLoaclData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if(!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    fetchNetData(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then((responseData) => {
                    this.saveData(url, responseData);
                    resolve(responseData);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }
    _wrapData(data) {
        return {data: data, timeStamp: new Date().getTime()};
    }


    /**
     * 检查timeStamp是否在有效期内
     * @param timeStamp
     * @returns {boolean}
     */
    static checkTimeStampValid(timeStamp) {
        const currentDate = new Date();
        const targetDate = new Date();
        targetDate.setTime(timeStamp);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;
        // 可以增加年的判断
        return true;
    }
}
