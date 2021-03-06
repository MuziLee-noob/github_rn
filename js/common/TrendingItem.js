import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';

export default class TrendingItem extends Component {
    render() {
        const {item} = this.props;
        if (!item) return null;
        let description = '<p/' + item.description + '>';
        let favoriteButton =
            <TouchableOpacity
                style={{padding: 6}}
                onPress={() => {

                }}
                underlayColor={'transparent'}
            >
                <FontAwesome
                    name={'star-o'}
                    size={26}
                    style={{color: 'red'}}
                />
            </TouchableOpacity>;
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {item.fullName}
                    </Text>
                    <HTMLView
                        value={description}
                        onLinkPress={(url) => {
                        }}
                        stylesheet={{
                            p: styles.description,
                            a: styles.description
                        }}
                    />
                    <Text style={styles.description}>
                        {item.meta}
                    </Text>
                    <View style={styles.row}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Author:</Text>
                            {item.contributors.map((result, index, arr) => {
                                return <Image key={index} style={{height: 22, width: 22}} source={{uri: arr[index]}}/>
                            })}
                        </View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Star:</Text>
                            <Text>{item.starCount}</Text>
                        </View>
                        {favoriteButton}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5}, // IOS设置阴影
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2 // 安卓设置阴影
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    }
});
