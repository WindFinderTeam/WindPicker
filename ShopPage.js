import  React, {Component} from 'react';
import {
    ScrollView,
    Text,
    Image,
    StyleSheet
} from 'react-native';

class ShopPage extends Component {
    render() {
        return (
            <ScrollView>
                <Text style={{fontFamily:'bmdohyeon'}}>나 는이세진 입니다</Text>
                <Text style={{fontFamily:'roboto'}}>나 는이세진 입니다</Text>
                <Text >나 는이세진 입니다</Text>
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
