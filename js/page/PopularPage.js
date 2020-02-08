import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux';
import actions from '../action';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=starts';
const THEME_COLOR = 'red';

export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.tabNames = ['Java', 'Android', 'IOS', 'React Native']
    }
    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <PopularTabPage {...props} tabLabel={item}/>,
                    navigationOptions: {
                        title: item
                    }
            }
        });
        return tabs;
    }
    render() {
        const TopTabNavigator = createAppContainer(createMaterialTopTabNavigator(
            this._genTabs(),
            {
                tabBarOptions: {
                    upperCaseLabel: false,
                    scrollEnabled: true,
                    tabStyle: styles.tabStyle,
                    style: {
                        backgroundColor: '#a67',
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                }
            }
        ));
        return (
            <View style={styles.container}>
                <TopTabNavigator/>
            </View>
        )
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props);
        const {tabLabel} = this.props;
        this.storeName = tabLabel;
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const {onLoadPopularData} = this.props;
        const url = this._genFetchUrl(this.storeName);
        onLoadPopularData(this.storeName, url);
    }

    _genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }
    renderItem(data) {
        const item = data.item;
        return <View style={{marginBottom: 10}}>
            <Text style={{backgroundColor: '#ffe39f'}}>
                {JSON.stringify(item)}
            </Text>
        </View>
    }

    render() {
        const {popular} = this.props;
        let store = popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.items}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => '' + item.id}
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
    }
});

const mapStateToProps = state => ({
   popular: state.popular
});

const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);
