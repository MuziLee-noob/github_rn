import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    TouchableOpacity
} from 'react-native';
import actions from '../action';
import {connect} from 'react-redux';
import NavigationBar from '../common/NavigationBar';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const THEME_COLOR='#678';
class MyPage extends Component {
    getRightButton() {
        return <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
                onPress={() => {}}
            >
                <View style={{padding: 5, marginRight: 8}}>
                    <Feather
                        name={'search'}
                        size={24}
                        style={{color: 'white'}}
                    />
                </View>
            </TouchableOpacity>
            </View>
    }

    getLeftButton(callback) {
        return <TouchableOpacity style={{padding: 8, paddingLeft: 12}} onPress={callback}>
            <Ionicons
                name={'ios-arrow-back'}
                size={24}
                style={{color: 'white'}}
            />
        </TouchableOpacity>
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
            title={'我的'}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
            rightButton={this.getRightButton()}
            leftButton={this.getLeftButton()}
        />;
        return (
            <View style={styles.container}>
                {navigationBar}
                <Text style={styles.welcome}>MyPage</Text>
                <Button
                    title={'修改主题'}
                    onPress={() => this.props.onThemeChange('#8a3')}
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
    }
});

const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});

export default connect(null, mapDispatchToProps)(MyPage);
