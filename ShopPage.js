import  React, {Component} from 'react';
import {
    ScrollView,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
                <Image source={require('./image/surfing.jpg')}
                       style={{flex: 1, width:Dimensions.get('window').width, height: 250, justifyContent: 'center',}} >
                    <Ionicons name={"ios-arrow-down"} size={30}/>
                    </Image>
            </ScrollView>
        )
    }
}


module.exports = ShopPage;
