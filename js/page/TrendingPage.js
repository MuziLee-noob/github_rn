import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import actions from '../action';
import TrendingItem from '../common/TrendingItem';
import {onLoadMoreTrending, onLoadTrendingData} from '../action/trending';
import NavigationBar from '../common/NavigationBar';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';

const URL = 'https://github.com/trending/';
const THEME_COLOR = '#678';

export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.tabNames = ['All', 'Java', 'PHP', 'Javascript'];
        this.state = {
            timeSpan: TimeSpans[0]
        }
    }
    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <TrendingTabPage {...props} tabLabel={item} timeSpan={this.state.timeSpan}/>,
                navigationOptions: {
                    title: item
                }
            }
        });
        return tabs;
    }
    renderTitleView() {
        return <View>
            <TouchableOpacity
                underlayColor='transparent'
                onPress={() => this.dialog.show()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400',
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{color: 'white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>;
    }

    onSelectTimeSpan(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab
        })
    }
    renderTrendingDialog() {
        return <TrendingDialog
            ref={dialog => this.dialog = dialog}
            onSelect={tab => this.onSelectTimeSpan(tab)}
        />
    }
    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />;
        const TopTabNavigator = createAppContainer(createMaterialTopTabNavigator(
            this._genTabs(),
            {
                tabBarOptions: {
                    upperCaseLabel: false,
                    scrollEnabled: true,
                    tabStyle: styles.tabStyle,
                    style: {
                        backgroundColor: THEME_COLOR,
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                }
            }
        ));
        return (
            <View style={styles.container}>
                {navigationBar}
                <TopTabNavigator/>
                {this.renderTrendingDialog()}
            </View>
        )
    }
}

const pageSize = 10; // 页面大小常量

class TrendingTab extends Component {
    constructor(props) {
        super(props);
        const {tabLabel, timeSpan} = this.props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan;
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(loadMore) {
        const {onLoadTrendingData, onLoadMoreTrending} = this.props;
        const store = this._store();
        const url = this._genFetchUrl(
            this.storeName === 'All' ? '' : this.storeName
        );
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                this.refs.toast.show('没有更多了');
            })
        } else {
            onLoadTrendingData(this.storeName, url, pageSize);
        }
    }

    /**
     * 获取与当前页面有关的数据
     * @private
     */
    _store() {
        const {trending} = this.props;
        let store = trending[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
                hideLoadingMore: true,
            }
        }
        return store;
    }

    /**
     *
     * @param key
     * @returns {string}
     * @private
     */
    _genFetchUrl(key) {
        return URL + key + '?' + this.timeSpan.searchText;
    }
    renderItem(data) {
        const item = data.item;
        return <TrendingItem
            item={item}
            onSelect={() => {

            }}
        />
    }

    /**
     * 加载更多组件
     */
    genIndicator() {
        return this._store().hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多...</Text>
            </View>
    }

    render() {
        const {trending} = this.props;
        let store = this._store();
        if (!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => '' + (item.id || item.fullName)}
                    refreshControl={
                        <RefreshControl
                            refreshing={store.isLoading}
                            title={'loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        setTimeout(() => {
                            if (this.canLoadMore) {
                                this.loadData(true);
                                this.canLoadMore = false;
                            }
                        }, 100)
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true;
                    }}
                />
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    tabStyle: {
        minWidth: 50
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});

const mapStateToProps = state => ({
    trending: state.trending
});

const mapDispatchToProps = dispatch => ({
    onLoadTrendingData: (storeName, url, pageSize) => dispatch(actions.onLoadTrendingData(storeName, url, pageSize)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callBack))
});

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);
