import  React, {Component} from 'react';
import {
    ScrollView,
    Image,
    View
} from 'react-native';

class FavoritePage extends Component {
    render() {
        return (
            <ScrollView>
                <Image source={{uri: "http://facebook.github.io/jest/img/opengraph.png"}}
                       style={{flex: 1, height: 320}} resizeMode="cover"/>
                <Image source={{uri: "http://facebook.github.io/jest/img/opengraph.png"}}
                       style={{flex: 1, height: 320}} resizeMode="cover"/>
                <Image source={{uri: "http://facebook.github.io/jest/img/opengraph.png"}}
                       style={{flex: 1, height: 320}} resizeMode="cover"/>
            </ScrollView>
        )
    }
}

module.exports = FavoritePage;
