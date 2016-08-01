import  React, {Component} from 'react';
import {
    ScrollView,
    Text,
    Image
} from 'react-native';

class ShopPage extends Component {
    render() {
        return (
            <ScrollView>
                <Image source={{uri: "http://www.adweek.com/socialtimes/files/2014/11/FlowLogo650.jpg"}}
                       style={{flex: 1, height: 320}} resizeMode="contain"/>
                <Image source={{uri: "http://www.adweek.com/socialtimes/files/2014/11/FlowLogo650.jpg"}}
                       style={{flex: 1, height: 320}} resizeMode="contain"/>
                <Image source={{uri: "http://www.adweek.com/socialtimes/files/2014/11/FlowLogo650.jpg"}}
                       style={{flex: 1, height: 320}} resizeMode="contain"/>
            </ScrollView>
        )
    }
}

module.exports = ShopPage;
